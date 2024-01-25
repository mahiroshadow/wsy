import { nextTick } from "vue"

export async function draw(){
  await nextTick()
  const canvas=document.getElementById("panel")
  console.log(canvas)
  const ctx=canvas.getContext("2D")
  console.log(ctx)
}