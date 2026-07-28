import type { H3Event, EventHandlerRequest } from "h3";

export type ResponseGetAll = {
  currentPage: number;
  totalPages: number;
  total: number;
  items: any[];
};

export type H3EventHandlerRequest = H3Event<EventHandlerRequest>;
