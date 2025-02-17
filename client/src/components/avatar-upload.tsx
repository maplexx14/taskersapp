import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/lib/i18n";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  username: string;
}

export function AvatarUpload({ currentAvatar, username }: AvatarUploadProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await apiRequest("POST", "/api/avatar", formData);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: t("avatarUpdated"),
        description: t("avatarUpdateSuccess"),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("avatarUpdateError"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t("avatarSizeError"),
          description: t("avatarSizeLimit"),
          variant: "destructive",
        });
        return;
      }

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      uploadMutation.mutate(file);
    }
  };

  const clearAvatar = () => {
    setPreviewUrl(null);
    uploadMutation.mutate(new File([], "empty"));
  };

  const initials = username
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-4">
      <Label>{t("avatar")}</Label>
      <div className="flex items-center gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Avatar className="h-20 w-20">
            <AvatarImage src={previewUrl || currentAvatar || undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </motion.div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="relative" disabled={uploadMutation.isPending}>
              <Input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploadMutation.isPending}
              />
              <Upload className="h-4 w-4 mr-2" />
              {t("uploadAvatar")}
            </Button>
            {(currentAvatar || previewUrl) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAvatar}
                disabled={uploadMutation.isPending}
              >
                <X className="h-4 w-4 mr-2" />
                {t("removeAvatar")}
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {t("avatarRequirements")}
          </p>
        </div>
      </div>
    </div>
  );
}
