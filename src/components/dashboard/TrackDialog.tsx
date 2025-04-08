
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, FileText, Image, Upload } from "lucide-react";
import { Order, OrderStatus, TaskNote } from "@/types";
import { toast } from "sonner";

interface TrackDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (orderId: string, status: OrderStatus) => void;
}

export const TrackDialog = ({
  order,
  open,
  onOpenChange,
  onStatusChange
}: TrackDialogProps) => {
  const { t } = useLanguage();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<TaskNote[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState(order.status);
  const [estimatedHours, setEstimatedHours] = useState(0);
  const [estimatedMinutes, setEstimatedMinutes] = useState(0);
  const [estimatedSeconds, setEstimatedSeconds] = useState(0);

  // Handle adding a note
  const handleAddNote = () => {
    if (!noteText.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    const newNote: TaskNote = {
      id: `note-${Date.now()}`,
      content: noteText,
      createdAt: new Date().toISOString(),
      createdBy: "Current User", // Would come from auth context in real app
    };

    setNotes([...notes, newNote]);
    setNoteText("");
    setIsAddingNote(false);
    toast.success(t("saveNote"));
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
      
      // Create preview URLs for images
      const newImages = filesArray.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  // Save tracking information
  const handleSave = () => {
    // Convert time to minutes for the order's expected completion time
    const totalMinutes = (estimatedHours * 60) + estimatedMinutes + (estimatedSeconds / 60);
    
    if (onStatusChange) {
      onStatusChange(order.id, status);
    }
    
    // Here you would typically save all the tracking data to your backend
    toast.success(t("orderProgress") + " " + t("saveNote"));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("track")} - {t("orderProgress")}</DialogTitle>
          <DialogDescription>
            {t("ordersDashboard")} #{order.orderId}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            {/* Order Status */}
            <div className="space-y-2">
              <Label htmlFor="status">{t("orderStatus")}</Label>
              <Select 
                value={status} 
                onValueChange={(value) => setStatus(value as OrderStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("orderStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{t("shipping")}</SelectItem>
                  <SelectItem value="in_progress">{t("almostDone")}</SelectItem>
                  <SelectItem value="completed">{t("completed")}</SelectItem>
                  <SelectItem value="cancelled">{t("issue")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estimated Completion Time */}
            <div className="space-y-2">
              <Label>{t("estimatedCompletion")}</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="hours">{t("hours")}</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="minutes">{t("minutes")}</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    max="59"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="seconds">{t("seconds")}</Label>
                  <Input
                    id="seconds"
                    type="number"
                    min="0" 
                    max="59"
                    value={estimatedSeconds}
                    onChange={(e) => setEstimatedSeconds(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>{t("uploadImages")}</Label>
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
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {images.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>{t("notes")}</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingNote(!isAddingNote)}
                >
                  {isAddingNote ? t("cancel") : t("addNote")}
                </Button>
              </div>

              {isAddingNote && (
                <div className="space-y-3 mb-4">
                  <Textarea
                    placeholder={t("addNote") + "..."}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleAddNote}
                      size="sm"
                    >
                      {t("saveNote")}
                    </Button>
                  </div>
                </div>
              )}

              {notes.length > 0 ? (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-gray-50 rounded-md p-3"
                    >
                      <p className="text-sm">{note.content}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        <span>
                          {new Date(
                            note.createdAt
                          ).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(note.createdAt).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("notes") + "..."}
                </p>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave}>
            {t("saveNote")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrackDialog;
