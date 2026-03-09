
import express from "express"
import { Server } from "../../../server/server"
export function buildTestServer() {
  const server = new Server(express())
  return server
}