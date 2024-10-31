"use client";
import { Eye, Clock, Calendar, Video, User, Star, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Database } from "@/types/database";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { toast } from "sonner";
import Link from "next/link";

export default function TwitchClipCard({
  url,
  broadcaster_name,
  creator_name,
  title,
  view_count,
  created_at_twitch,
  thumbnail_url,
  duration,
  is_featured,
}: Database["public"]["Tables"]["clips"]["Row"]) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full max-w-md overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative">
          <img src={thumbnail_url!} alt={title} className="w-full h-48 object-cover" />
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">{formatDuration(duration!)}</Badge>
          {is_featured && (
            <Badge className="absolute bottom-2 left-2 bg-yellow-500 text-yellow-950">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 line-clamp-2">{title}</CardTitle>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
          <User className="w-4 h-4" />
          <span>{creator_name}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          {view_count!.toLocaleString()} views
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(created_at_twitch!)}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 text-right">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Link href={url!} target="_blank">
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(url!)}>View</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(url!)}>Copy Command ID</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
}
