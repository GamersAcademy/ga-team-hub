
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KnowledgeItem, KnowledgeType } from "@/types";
import {
  BookOpen,
  Calendar,
  ExternalLink,
  FileText,
  Image,
  Info,
  MessageSquare,
  Pencil,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface KnowledgeCardProps {
  item: KnowledgeItem;
  isEditable?: boolean;
  onUpdate?: (updatedItem: KnowledgeItem) => void;
}

export const KnowledgeCard = ({
  item,
  isEditable = false,
  onUpdate,
}: KnowledgeCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<KnowledgeItem>({ ...item });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Format creation date
  const creationDate = new Date(item.createdAt);
  const formattedDate = creationDate.toLocaleDateString();

  // Get type icon and badge
  const getTypeIcon = (type: KnowledgeType) => {
    switch (type) {
      case "guide":
        return <BookOpen className="h-5 w-5" />;
      case "instruction":
        return <FileText className="h-5 w-5" />;
      case "policy":
        return <Info className="h-5 w-5" />;
      case "faq":
        return <MessageSquare className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeBadge = (type: KnowledgeType) => {
    switch (type) {
      case "guide":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Guide</Badge>;
      case "instruction":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Instruction</Badge>;
      case "policy":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Policy</Badge>;
      case "faq":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">FAQ</Badge>;
      default:
        return <Badge variant="outline">Document</Badge>;
    }
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Handle save changes
  const handleSaveChanges = () => {
    if (onUpdate && isEditable) {
      onUpdate(editedItem);
      setIsEditing(false);
      setIsDialogOpen(false);
      toast.success(`Updated "${editedItem.title}" successfully`);
    }
  };

  return (
    <Card className={cn("h-full", item.department && "border-l-4 border-l-blue-500")}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
          {getTypeBadge(item.type)}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        {/* Preview of content - truncated */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {item.content}
        </p>

        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
          {item.department && <span>• {item.department}</span>}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full gap-1">
              <ExternalLink className="h-4 w-4" />
              <span>View Full Content</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(item.type)}
                  <DialogTitle className="text-xl">
                    {isEditing ? "Edit Document" : item.title}
                  </DialogTitle>
                </div>
                {getTypeBadge(item.type)}
              </div>
              <DialogDescription>
                {!isEditing && (
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-sm">
                      Created by {item.createdBy} on {formattedDate}
                      {item.updatedAt && ` • Updated ${new Date(item.updatedAt).toLocaleDateString()}`}
                    </div>
                    {item.department && (
                      <Badge variant="outline">{item.department}</Badge>
                    )}
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>

            {isEditing ? (
              <div className="space-y-4 py-4">
                <div className="space-y-1">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editedItem.title}
                    onChange={(e) =>
                      setEditedItem({ ...editedItem, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={editedItem.content}
                    onChange={(e) =>
                      setEditedItem({ ...editedItem, content: e.target.value })
                    }
                    className="min-h-[300px]"
                  />
                </div>
              </div>
            ) : (
              <ScrollArea className="max-h-[500px] pr-4 py-4">
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{item.content}</p>

                  {/* Attachments */}
                  {item.attachments && item.attachments.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-2">Attachments</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {item.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 transition-colors"
                          >
                            {getAttachmentIcon(attachment.type)}
                            <span className="text-sm truncate">{attachment.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}

            <DialogFooter>
              {isEditable && (
                isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedItem({ ...item });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                )
              )}
              <Button
                variant={isEditing ? "outline" : "default"}
                onClick={() => !isEditing && setIsDialogOpen(false)}
              >
                {isEditing ? "Cancel" : "Close"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
