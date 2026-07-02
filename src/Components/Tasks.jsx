import { Box, Button, Typography } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
export default function StudentTasks() {
  const [tasks] = useState([
    {
      id: 1,
      type: "code",
      language: "javascript",
      title: "Frontend Component",
      content: `import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
export default function MilestoneTabs() {
  const [value, setValue] = useState(0);
  return (
    <Box className="w-full">
      <Tabs
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        TabIndicatorProps={{
          style: {
            backgroundColor: "#243B56",
            height: "2px",
          },
        }}
        sx={{
          borderBottom: "1px solid #E5E7EB",
          "& .MuiTab-root": {
            color: "#27272A",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 500,
          },
          "& .Mui-selected": {
            color: "#27272A",
            fontWeight: 600,
          },
        }}
      >
        <Tab label="Current Milestone: Frontend" />
        <Tab label="Final Report" />
      </Tabs>
    </Box>
  );
}
`,
      status: "Pending",
      date: "2026-02-07",
    },
  ]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Tasks</h2>

      <div className="flex flex-col gap-4 max-h-96 overflow-y-auto">
        {tasks.map((task) => (
          <Box
            key={task.id}
            className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <Typography fontWeight={600}>{task.title}</Typography>
              <span
                className={`px-2 py-1 rounded text-sm font-semibold ${
                  task.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {task.status}
              </span>
            </div>

            {/* Dynamic content */}
            {task.type === "code" && (
              <SyntaxHighlighter
                language={task.language}
                style={materialDark}
                className="rounded-lg p-2"
              >
                {task.content}
              </SyntaxHighlighter>
            )}

            {task.type === "diagram" && (
              <img
                src={task.imageUrl}
                alt={task.title}
                className="max-h-64 object-contain rounded-lg border"
              />
            )}

            {task.type === "file" && (
              <div className="flex items-center gap-2">
                <Typography>{task.fileName}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  href={task.fileUrl}
                  target="_blank"
                >
                  Download
                </Button>
              </div>
            )}
          </Box>
        ))}
      </div>
    </div>
  );
}
