/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineConfig } from "orval";

export default defineConfig({
  backend: {
    output: {
      mode: "tags-split",
      target: "./apis/backend.ts",
      schemas: "./models",
      client: "react-query",
      headers: true,
      clean: true,
      override: {
        mutator: {
          path: "./orval-custom-instance.ts",
          name: "api",
        },
      },
    },
    input: {
      target: "./swagger.json",
      override: {
        transformer: (openApiSpec: any) => {
          const final = openApiSpec;

          return final;
        },
      },
    },
    hooks: {
      afterAllFilesWrite: ["prettier --write"],
    },
  },
});
