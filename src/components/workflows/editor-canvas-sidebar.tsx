import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditor } from "@/hooks/UseWorkflowEditor";
import { EditorCanvasDefaultCard, NodeSettingsComponent } from "@/lib/workflow-const";
import { Zap } from "lucide-react";
import RenderOutputAccordion from "./render-output-accordian";
import { onDragStart } from "@/lib/utils";
import LogList from "./log-list";

export default function WorkflowCanvasSidebar() {
  const { state, handleSave, dispatch } = useEditor();

  const handleTabChange = (value: string) => {
    dispatch({ type: "SET_SIDEBAR", payload: { sidebar: value as "triggers" | "actions" | "settings" } });
  };
  const triggerAlreadyExists = state.editor.nodes.find((node) => node.type === "Trigger");
  return (
    <aside className="h-full relative">
      <Tabs defaultValue="triggers" value={state.editor.sidebar} onValueChange={handleTabChange} className="h-full bg-[#0A0A0A]">
        <div className="flex justify-between">
          <TabsList className="bg-transparent block">
            {triggerAlreadyExists ? <TabsTrigger value="actions">Actions</TabsTrigger> : <TabsTrigger value="triggers">Triggers</TabsTrigger>}
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          <div>
            <Button type="button" className="text-white" onClick={() => handleSave()}>
              Save
            </Button>
          </div>
        </div>
        <Separator />
        <div className="h-full overflow-scroll pb-14">
          <TabsContent value="triggers">
            {Object.entries(EditorCanvasDefaultCard).map(([provider, ProviderValues], index) => (
              <Accordion key={index} type="multiple">
                <AccordionItem value="Options" className="px-2">
                  <AccordionTrigger className="!no-underline">{provider}</AccordionTrigger>
                  <AccordionContent>
                    {ProviderValues.triggers.map((Trigger, index) => (
                      <Card
                        key={index}
                        draggable
                        onDragStart={(e) => onDragStart(e, Trigger.type, provider)}
                        className="flex flex-row items-center p-4 my-4 cursor-pointer"
                      >
                        <div>{Trigger.icon ? <Trigger.icon size={30} /> : <Zap size={30} />}</div>
                        <CardHeader>
                          <CardTitle>{Trigger.title}</CardTitle>
                          <CardDescription>{Trigger.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </TabsContent>
          <TabsContent value="actions">
            {Object.entries(EditorCanvasDefaultCard).map(([provider, ProviderValues], index) => (
              <Accordion key={index} type="multiple">
                <AccordionItem value="Options" className="px-2">
                  <AccordionTrigger className="!no-underline">{provider}</AccordionTrigger>
                  <AccordionContent>
                    {ProviderValues.actions.map((action, index) => (
                      <Card
                        key={index}
                        draggable
                        onDragStart={(e) => onDragStart(e, action.type, provider)}
                        className="flex flex-row items-center p-4 my-4 cursor-pointer"
                      >
                        <div>{action.icon ? <action.icon size={30} /> : <Zap size={30} />}</div>
                        <CardHeader>
                          <CardTitle>{action.title}</CardTitle>
                          <CardDescription>{action.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </TabsContent>
          <TabsContent value="settings">
            <div className="px-4 ">
              <RenderOutputAccordion
                SettingsComponent={
                  NodeSettingsComponent[
                    state.editor.selectedNode ? (state.editor.selectedNode.data.type as keyof typeof NodeSettingsComponent) : "default-settings"
                  ]
                }
              />
            </div>
          </TabsContent>
          <TabsContent value="logs">
            <div className="px-4 ">{state.editor.logs.length > 0 ? <LogList /> : <div className="text-white">No logs</div>}</div>
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
}
