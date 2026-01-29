import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { MainLayout } from "@/components/layout/MainLayout";
import { PostCard } from "@/components/feed/PostCard";
import { CreatePostForm } from "@/components/feed/CreatePostForm";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface PostWithProfile {
  id: string;
  content: string;
  media_url: string | null;
  media_type: string | null;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  user_id: string;
  profiles: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  likes: { user_id: string }[];
  comments: { id: string }[];
}

export default function Feed() {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: posts, isLoading, error, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles!posts_user_id_fkey (username, display_name, avatar_url),
          likes (user_id),
          comments (id)
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as unknown as PostWithProfile[];
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("No autenticado");
      
      const { error } = await supabase
        .from("posts")
        .insert({ user_id: user.id, content });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Publicación creada");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Feed</h1>
              <p className="text-sm text-muted-foreground">Territorio de comunicación soberana</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>

          {/* Create Post Form */}
          {user ? (
            <CreatePostForm 
              onSubmit={(content) => createPostMutation.mutate(content)}
              isLoading={createPostMutation.isPending}
            />
          ) : (
            <div className="tamv-card p-6 mb-6 text-center">
              <p className="text-muted-foreground mb-4">
                Inicia sesión para publicar en el feed
              </p>
              <Link to="/auth/login">
                <Button>Iniciar sesión</Button>
              </Link>
            </div>
          )}

          {/* Posts List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="tamv-card p-6 text-center">
              <p className="text-destructive mb-4">Error al cargar publicaciones</p>
              <Button variant="outline" onClick={() => refetch()}>
                Reintentar
              </Button>
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  currentUserId={user?.id}
                />
              ))}
            </div>
          ) : (
            <div className="tamv-card p-12 text-center">
              <p className="text-muted-foreground">
                No hay publicaciones aún. Sé el primero en compartir.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
