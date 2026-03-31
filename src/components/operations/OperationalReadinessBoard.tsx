import { type ReactNode, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  getReadinessDomains,
  getReadinessProgress,
  getMilestoneProgress,
  getDomainProgress,
  cycleTaskStatus,
  resetReadiness,
  type ReadinessStatus,
  type ReadinessDomain,
} from "@/lib/operational-readiness";
import { CheckCircle2, Clock3, CircleDashed, Target, RotateCcw } from "lucide-react";

const statusLabel: Record<ReadinessStatus, string> = {
  backlog: "Backlog",
  in_progress: "En progreso",
  done: "Listo",
};

const statusClass: Record<ReadinessStatus, string> = {
  backlog: "bg-muted text-muted-foreground border-border",
  in_progress: "bg-warning/20 text-warning border-warning/40",
  done: "bg-success/20 text-success border-success/40",
};

const statusIcon: Record<ReadinessStatus, ReactNode> = {
  backlog: <CircleDashed className="w-3 h-3" />,
  in_progress: <Clock3 className="w-3 h-3" />,
  done: <CheckCircle2 className="w-3 h-3" />,
};

export function OperationalReadinessBoard() {
  const [domains, setDomains] = useState<ReadinessDomain[]>(getReadinessDomains);
  const [, setTick] = useState(0);

  const refresh = useCallback(() => {
    setDomains([...getReadinessDomains()]);
    setTick((t) => t + 1);
  }, []);

  const handleCycleStatus = useCallback(
    (taskId: string) => {
      cycleTaskStatus(taskId);
      refresh();
    },
    [refresh],
  );

  const handleReset = useCallback(() => {
    resetReadiness();
    refresh();
  }, [refresh]);

  const globalProgress = getReadinessProgress(domains);
  const stageProgress = getMilestoneProgress(domains, "stage");
  const productionProgress = getMilestoneProgress(domains, "production");

  return (
    <div className="space-y-4">
      <Card className="tamv-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Centro de Preparación Operativa</CardTitle>
              <CardDescription>
                Estado consolidado para pasar de beta privada a stage semi-real y producción pública.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1 text-xs">
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Progreso global</span>
              <span className="font-semibold">{globalProgress}%</span>
            </div>
            <Progress value={globalProgress} />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Meta stage</span>
              <span className="font-semibold">{stageProgress}%</span>
            </div>
            <Progress value={stageProgress} />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Meta producción</span>
              <span className="font-semibold">{productionProgress}%</span>
            </div>
            <Progress value={productionProgress} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {domains.map((domain) => {
          const domainPct = getDomainProgress(domain);
          return (
            <Card key={domain.id} className="tamv-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  {domain.label}
                  <span className="ml-auto text-xs font-normal text-muted-foreground">
                    {domainPct}%
                  </span>
                </CardTitle>
                <CardDescription>{domain.description}</CardDescription>
                <Progress value={domainPct} className="h-1 mt-2" />
              </CardHeader>
              <CardContent className="space-y-2">
                {domain.tasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => handleCycleStatus(task.id)}
                    className="flex items-start justify-between gap-2 border border-border rounded-md p-2 w-full text-left hover:border-primary/40 transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Owner: {task.owner} · Milestone: {task.milestone}
                      </p>
                    </div>
                    <Badge className={`gap-1 shrink-0 ${statusClass[task.status]}`}>
                      {statusIcon[task.status]}
                      {statusLabel[task.status]}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
