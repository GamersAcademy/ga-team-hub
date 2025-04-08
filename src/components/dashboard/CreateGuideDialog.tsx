
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GuidePage } from "@/types";
import { toast } from "sonner";
import { Link, Plus, Upload, X } from "lucide-react";

interface CreateGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (guide: GuidePage) => void;
}

export const CreateGuideDialog = ({
  open,
  onOpenChange,
  onSave,
}: CreateGuideDialogProps) => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [links, setLinks] = useState<Array<{ title: string; url: string }>>([]);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isAddingLink, setIsAddingLink] = useState(false);

  // Handle file selection for images
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
      
      // Create preview URLs for images
      const newImages = filesArray.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  // Handle adding video URL
  const handleAddVideo = () => {
    if (!videoUrl.trim()) return;
    
    // Simple validation to check if it's a valid URL
    try {
      new URL(videoUrl);
      setVideos([...videos, videoUrl]);
      setVideoUrl("");
    } catch (err) {
      toast.error(t("invalidUrl"));
    }
  };

  // Handle adding external link
  const handleAddLink = () => {
    if (!linkTitle.trim() || !linkUrl.trim()) return;
    
    // Simple validation to check if it's a valid URL
    try {
      new URL(linkUrl);
      setLinks([...links, { title: linkTitle, url: linkUrl }]);
      setLinkTitle("");
      setLinkUrl("");
      setIsAddingLink(false);
    } catch (err) {
      toast.error(t("invalidUrl"));
    }
  };

  // Handle removing image
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  // Handle removing video
  const handleRemoveVideo = (index: number) => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    setVideos(newVideos);
  };

  // Handle removing link
  const handleRemoveLink = (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    setLinks(newLinks);
  };

  // Handle save guide
  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast.error(t("fillRequiredFields"));
      return;
    }
    
    const newGuide: GuidePage = {
      id: `guide-${Date.now()}`,
      title,
      content,
      createdBy: currentUser?.name || "Admin",
      createdAt: new Date().toISOString(),
      images,
      videoUrls: videos,
      externalLinks: links,
    };
    
    onSave(newGuide);
    
    // Reset form
    setTitle("");
    setContent("");
    setImages([]);
    setSelectedFiles([]);
    setVideos([]);
    setVideoUrl("");
    setLinks([]);
    setLinkTitle("");
    setLinkUrl("");
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("addNewGuide")}</DialogTitle>
          <DialogDescription>
            {t("create")} {t("new")} {t("knowledge")} {t("guide")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 py-4 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{t("title")}*</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("title")}
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">{t("content")}*</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("content")}
              className="min-h-[200px]"
              required
            />
          </div>

          {/* Images */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>{t("images")}</Label>
              <Label
                htmlFor="image-upload"
                className="cursor-pointer flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Upload className="h-4 w-4" />
                {t("uploadImages")}
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-2">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt={`Guide image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Videos */}
          <div className="space-y-3">
            <Label>{t("videos")}</Label>
            
            <div className="flex gap-2">
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={handleAddVideo}
              >
                <Plus className="h-4 w-4 mr-1" /> {t("add")}
              </Button>
            </div>

            {videos.length > 0 && (
              <div className="space-y-2 mt-2">
                {videos.map((video, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <a 
                      href={video} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline truncate flex-1"
                    >
                      {video}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(index)}
                      className="ml-2"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* External Links */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>{t("externalLinks")}</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setIsAddingLink(!isAddingLink)}
              >
                {isAddingLink ? t("cancel") : (
                  <>
                    <Plus className="h-4 w-4 mr-1" /> {t("addLink")}
                  </>
                )}
              </Button>
            </div>

            {isAddingLink && (
              <div className="space-y-3 p-3 border rounded-md">
                <div className="space-y-2">
                  <Label htmlFor="linkTitle">{t("title")}</Label>
                  <Input
                    id="linkTitle"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    placeholder={t("title")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkUrl">URL</Label>
                  <Input
                    id="linkUrl"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={handleAddLink}
                  >
                    {t("add")}
                  </Button>
                </div>
              </div>
            )}

            {links.length > 0 && (
              <div className="space-y-2 mt-2">
                {links.map((link, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2 truncate flex-1">
                      <Link className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate"
                      >
                        {link.title}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(index)}
                      className="ml-2"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave}>
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGuideDialog;
