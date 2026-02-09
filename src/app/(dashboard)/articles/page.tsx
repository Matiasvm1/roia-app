import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CreateArticleDialog } from "@/components/articles/create-article-dialog";
import { EditArticleDialog } from "@/components/articles/edit-article-dialog";

import { requireAdmin } from "@/lib/auth";

export default async function ArticlesPage() {
  await requireAdmin();

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orderItems: true } } },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artículos</h1>
          <p className="text-muted-foreground mt-1">
            {articles.length} artículos en el catálogo.
          </p>
        </div>
        <CreateArticleDialog />
      </div>

      {articles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <div className="rounded-full bg-muted p-4 mb-4">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <p className="font-medium">No hay artículos en el catálogo todavía</p>
            <p className="text-sm mt-1">
              Hacé click en &quot;Nuevo Artículo&quot; para agregar el primero.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card
              key={article.id}
              className={`group hover:shadow-md transition-all duration-200 ${!article.isActive ? "opacity-50" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{article.name}</CardTitle>
                    {article.category && (
                      <Badge variant="secondary" className="mt-1.5">
                        {article.category}
                      </Badge>
                    )}
                  </div>
                  <EditArticleDialog article={article} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-emerald-600">
                    ${article.basePrice.toLocaleString("es-AR")}
                  </span>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground">
                      {article._count.orderItems} pedidos
                    </span>
                    {!article.isActive && (
                      <Badge variant="secondary" className="ml-2">
                        Inactivo
                      </Badge>
                    )}
                  </div>
                </div>
                {article.description && (
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                    {article.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
