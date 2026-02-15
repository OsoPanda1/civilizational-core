import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, CheckCheck, Trash2, Loader2, Info, AlertTriangle, Shield, Zap } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export default function Notifications() {
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadNotifications();

    const channel = supabase
      .channel("notifications-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
        toast.info((payload.new as Notification).title);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);
    setNotifications(data || []);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true, read_at: new Date().toISOString() }).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ is_read: true, read_at: new Date().toISOString() }).eq("user_id", user.id).eq("is_read", false);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    toast.success("Todas marcadas como leídas");
  };

  const deleteNotification = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "security": return <Shield className="w-4 h-4 text-destructive" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-warning" />;
      case "economy": return <Zap className="w-4 h-4 text-primary" />;
      default: return <Info className="w-4 h-4 text-accent" />;
    }
  };

  if (authLoading) return <MainLayout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></MainLayout>;
  if (!user) return <Navigate to="/auth/login" replace />;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Notificaciones</h1>
              {unreadCount > 0 && <Badge className="bg-primary text-primary-foreground">{unreadCount}</Badge>}
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1">
                <CheckCheck className="w-3 h-3" /> Marcar todas
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : notifications.length === 0 ? (
            <Card className="tamv-card">
              <CardContent className="p-12 text-center">
                <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground">Sin notificaciones</p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[calc(100vh-250px)]">
              <div className="space-y-2">
                {notifications.map(n => (
                  <Card key={n.id} className={`tamv-card transition-colors ${!n.is_read ? "border-primary/30 bg-primary/5" : ""}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getIcon(n.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{n.title}</p>
                            <span className="text-[10px] text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {!n.is_read && (
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => markAsRead(n.id)}>
                              <Check className="w-3 h-3" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteNotification(n.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
