"use server";

import { createClient } from "@/lib/supabase/server";
import { Trigger } from "@/types/workflow";
import { Node } from "@xyflow/react";
import { revalidatePath } from "next/cache";

// get all workflows
export const onGetWorkflows = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("workflows").select("*");

  if (error) {
    throw error.message;
  }

  if (data) return data;
};

// get workflow by id
export const getWorkflowByID = async (workflowId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("workflows").select("*").match({ id: workflowId }).single();

  if (error) {
    throw error.message;
  }

  if (data) {
    return data;
  }
};

export const onFlowPublish = async (workflowId: string, state: boolean) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("workflows").update({ publish: state }).match({ id: workflowId });

  if (error) return error.message;

  if (state) return "Workflow published";
  return "Workflow unpublished";
};

export const onCreateWorkflow = async (name: string, description: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getSession();

  if (data.session) {
    //create new workflow
    const { data: workflow_data, error: workflow_error } = await supabase
      .from("workflows")
      .insert({ user_id: data.session.user.id, name, description, broadcaster_id: data.session.user.user_metadata.sub, publish: true });

    if (workflow_error) {
      console.error(workflow_error);
      return { message: "Oops! try again" };
    }

    revalidatePath("/dashboard/workflows");

    return { message: "Workflow created" };
  }
};

export const SaveWorkflow = async (flowId: string, nodes: string, edges: string) => {
  const supabase = await createClient();

  const { data: session } = await supabase.auth.getSession();
  const broadcaster_id = session?.session?.user?.user_metadata?.sub;

  const trigger = JSON.parse(nodes)
    .filter((node: Node) => node.type === "Trigger")
    .at(0)?.data;

  if (!trigger) return { error: "Trigger not found" };

  const { data, error } = await supabase.from("workflows").update({ nodes, edges, broadcaster_id }).match({ id: flowId });

  if (error) return error;

  const event_id = (trigger as Trigger).metaData?.event_id;

  // update the trigger event_id
  const { data: triggerData, error: triggerError } = await supabase
    .from("workflow_triggers")
    .update({ event_id, event_type: (trigger as Trigger).type })
    .match({ workflow: flowId });

  if (triggerError) {
    console.error(triggerError);
    return triggerError;
  }

  return {
    message: "flow saved",
  };
};
export const UpdatePulbishStatus = async (workflow_id: string, status: boolean) => {
  const supabase = await createClient();

  // update the trigger event_id
  const { data, error } = await supabase.from("workflows").update({ publish: status }).eq("id", workflow_id);

  if (error) {
    console.error(error);
    return error;
  }

  revalidatePath("/dashboard/workflows");

  return {
    message: "flow saved",
  };
};

// delete workflow
export const DeleteWorkflow = async (workflow_id: string) => {
  const supabase = await createClient();

  const { error } = await supabase.from("workflows").delete().eq("id", workflow_id);

  if (error) {
    return {
      message: "Failed to remove workflow",
    };
  }

  revalidatePath("/dashboard/workflows");

  return {
    message: "Workflow deleted",
  };
};

// update  workflow details

type WorkflowDetails = {
  workflow_id: string;
  name: string;
  description: string;
};

export const UpdateWorkflowDetails = async ({ workflow_id, description, name }: WorkflowDetails) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("workflows")
    .update({
      name,
      description,
    })
    .eq("id", workflow_id);

  if (error) {
    return {
      message: "Failed to remove workflow",
    };
  }

  revalidatePath("/dashboard/workflows");

  return {
    message: "Workflow deleted",
  };
};
