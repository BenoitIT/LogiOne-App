"use client"
import { withRolesAccess } from "@/components/auth/accessRights";
import ShippingInstruction from "./(prepartionDetails)/actualInstruction"

const Page=()=>{
  return <ShippingInstruction/>
}
export default withRolesAccess(Page, ["senior operation manager", "admin"]) as React.FC;