import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";

const postSchema = z.object({
  content: z
    .string()
    .min(1, "El contenido no puede estar vacío")
    .max(1000, "Máximo 1000 caracteres"),
});

type PostFormData = z.infer<typeof postSchema>;

interface CreatePostFormProps {
  onSubmit: (content: string) => void;
  isLoading: boolean;
}

export function CreatePostForm({ onSubmit, isLoading }: CreatePostFormProps) {
  const [charCount, setCharCount] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const handleFormSubmit = (data: PostFormData) => {
    onSubmit(data.content);
    reset();
    setCharCount(0);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="tamv-card p-4 mb-6">
      <Textarea
        placeholder="Comparte tu perspectiva con el territorio..."
        className="min-h-[100px] resize-none border-0 bg-transparent focus-visible:ring-0 p-0 mb-3"
        {...register("content", {
          onChange: (e) => setCharCount(e.target.value.length),
        })}
      />
      
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <span className={charCount > 900 ? "text-warning" : ""}>
            {charCount}
          </span>
          /1000
        </div>
        
        <Button type="submit" size="sm" disabled={isLoading || charCount === 0}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Publicar
            </>
          )}
        </Button>
      </div>
      
      {errors.content && (
        <p className="text-xs text-destructive mt-2">{errors.content.message}</p>
      )}
    </form>
  );
}
