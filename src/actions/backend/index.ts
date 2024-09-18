"use server";
import { auth } from "@/auth";
import StreamWizardAPI from "@/lib/axios/backend";
import { logs } from "@/types/workflow";

type WorkflowResponse = {
  message: string;
  node_responses: logs[];
};

export default async function TriggerWorkflow(workflowDetails: any) {
  const res = await StreamWizardAPI.post<WorkflowResponse>("/workflow/test", workflowDetails);

  return res.data;
}
