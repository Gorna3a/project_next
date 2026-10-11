import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas/index.ts";

export default defineConfig({
  name: "pixelcode-studio",
  title: "PixelCode Studio",

  // ─── Sanity project — initialized via:
  // npm create sanity@latest -- --project vfejjthj --dataset production --template clean
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "vfejjthj",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  // ─────────────────────────────────────────────────────────────────────────────

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("PixelCode Content")
          .items([
            S.listItem()
              .title("📚 Courses")
              .child(S.documentTypeList("course").title("All Courses")),

            S.listItem()
              .title("📦 Modules")
              .child(S.documentTypeList("module").title("All Modules")),

            S.divider(),

            S.listItem()
              .title("📖 Lessons")
              .child(
                S.list()
                  .title("Lessons by kind")
                  .items([
                    S.listItem()
                      .title("All lessons")
                      .child(S.documentTypeList("lesson").title("All Lessons")),
                    S.listItem()
                      .title("📘 Theory")
                      .child(
                        S.documentList()
                          .title("Theory lessons")
                          .filter('_type == "lesson" && kind == "theory"'),
                      ),
                    S.listItem()
                      .title("🛠 Workshops")
                      .child(
                        S.documentList()
                          .title("Workshops")
                          .filter('_type == "lesson" && kind == "workshop"'),
                      ),
                    S.listItem()
                      .title("🧪 Labs")
                      .child(
                        S.documentList()
                          .title("Labs")
                          .filter('_type == "lesson" && kind == "lab"'),
                      ),
                    S.listItem()
                      .title("📝 Reviews")
                      .child(
                        S.documentList()
                          .title("Reviews")
                          .filter('_type == "lesson" && kind == "review"'),
                      ),
                    S.listItem()
                      .title("❓ Quizzes")
                      .child(
                        S.documentList()
                          .title("Quizzes")
                          .filter('_type == "lesson" && kind == "quiz"'),
                      ),
                    S.listItem()
                      .title("🎓 Certification projects")
                      .child(
                        S.documentList()
                          .title("Certification projects")
                          .filter(
                            '_type == "lesson" && kind == "certification-project"',
                          ),
                      ),
                  ]),
              ),
          ]),
    }),

    visionTool(), // GROQ query explorer — great for debugging
  ],

  schema: {
    types: schemaTypes,
  },
});
