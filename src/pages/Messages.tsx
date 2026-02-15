import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  userId: string;
  username: string;
  displayName: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

export default function Messages() {
  const { user, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadConversations();

    // Realtime subscription
    const channel = supabase
      .channel("messages-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new as Message;
        if (msg.sender_id === user.id || msg.recipient_id === user.id) {
          if (selectedUser && (msg.sender_id === selectedUser || msg.recipient_id === selectedUser)) {
            setMessages(prev => [...prev, msg]);
          }
          loadConversations();
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, selectedUser]);

  const loadConversations = async () => {
    if (!user) return;
    setLoading(true);
    // Get all messages involving this user
    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!msgs) { setLoading(false); return; }

    // Group by conversation partner
    const convMap = new Map<string, { lastMessage: string; lastAt: string; unread: number }>();
    for (const m of msgs) {
      const partnerId = m.sender_id === user.id ? m.recipient_id : m.sender_id;
      if (!convMap.has(partnerId)) {
        convMap.set(partnerId, { lastMessage: m.content, lastAt: m.created_at, unread: (!m.is_read && m.recipient_id === user.id) ? 1 : 0 });
      } else {
        const c = convMap.get(partnerId)!;
        if (!m.is_read && m.recipient_id === user.id) c.unread++;
      }
    }

    // Fetch profiles
    const partnerIds = Array.from(convMap.keys());
    if (partnerIds.length > 0) {
      const { data: profiles } = await supabase.from("profiles").select("id, username, display_name").in("id", partnerIds);
      const convs: Conversation[] = partnerIds.map(id => {
        const p = profiles?.find(pr => pr.id === id);
        const c = convMap.get(id)!;
        return { userId: id, username: p?.username || "unknown", displayName: p?.display_name, lastMessage: c.lastMessage, lastMessageAt: c.lastAt, unread: c.unread };
      });
      setConversations(convs);
    } else {
      setConversations([]);
    }
    setLoading(false);
  };

  const loadMessages = async (partnerId: string) => {
    if (!user) return;
    setSelectedUser(partnerId);
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${user.id})`)
      .order("created_at", { ascending: true });
    setMessages(data || []);

    // Mark as read
    await supabase.from("messages").update({ is_read: true, read_at: new Date().toISOString() }).eq("sender_id", partnerId).eq("recipient_id", user.id).eq("is_read", false);
  };

  const sendMessage = async () => {
    if (!user || !selectedUser || !newMessage.trim()) return;
    setSending(true);
    const { error } = await supabase.from("messages").insert({ sender_id: user.id, recipient_id: selectedUser, content: newMessage.trim() });
    if (error) { toast.error("Error al enviar mensaje"); }
    else { setNewMessage(""); }
    setSending(false);
  };

  if (authLoading) return <MainLayout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></MainLayout>;
  if (!user) return <Navigate to="/auth/login" replace />;

  const selectedConv = conversations.find(c => c.userId === selectedUser);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Mensajes</h1>
          </div>

          <div className="grid md:grid-cols-3 gap-4 h-[calc(100vh-250px)]">
            {/* Conversations list */}
            <Card className="tamv-card md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Conversaciones</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-350px)]">
                  {loading ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">Cargando...</div>
                  ) : conversations.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">Sin conversaciones</div>
                  ) : (
                    conversations.map(c => (
                      <button key={c.userId} onClick={() => loadMessages(c.userId)}
                        className={`w-full p-3 text-left hover:bg-muted/50 transition-colors border-b border-border flex items-center gap-3 ${selectedUser === c.userId ? "bg-muted/50" : ""}`}>
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">{(c.displayName || c.username).slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{c.displayName || c.username}</p>
                            {c.unread > 0 && <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5">{c.unread}</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                        </div>
                      </button>
                    ))
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat area */}
            <Card className="tamv-card md:col-span-2 flex flex-col">
              {selectedUser ? (
                <>
                  <CardHeader className="pb-2 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedUser(null)}>
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">{(selectedConv?.displayName || selectedConv?.username || "?").slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-sm">{selectedConv?.displayName || selectedConv?.username}</CardTitle>
                    </div>
                  </CardHeader>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                      {messages.map(m => (
                        <div key={m.id} className={`flex ${m.sender_id === user.id ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${m.sender_id === user.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                            {m.content}
                            <p className={`text-[10px] mt-1 ${m.sender_id === user.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                              {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-3 border-t border-border flex gap-2">
                    <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Escribe un mensaje..."
                      onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()} className="flex-1" />
                    <Button size="icon" onClick={sendMessage} disabled={sending || !newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <CardContent className="flex-1 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Selecciona una conversación</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
