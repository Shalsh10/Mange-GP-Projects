import { Box, CircularProgress, Typography, Button } from "@mui/material";
export default function Card({
  title,
  value,
  color,
  children,
  onApprove,
  onReject,
}) {
  return (
    <>
      <Box
        sx={{
          border: "1px solid #E5E7EB",
          borderRadius: "12px",
          padding: "16px",
          width: "320px",
          backgroundColor: "#fff",
        }}
        className="flex flex-col gap-4"
      >
        <Typography sx={{ fontWeight: 600, color: "#2563EB" }}>
          {title}
        </Typography>
        <Box className="relative inline-flex self-center">
          <CircularProgress
            variant="determinate"
            value={100}
            size={120}
            thickness={5}
            sx={{ color: "#E5E7EB" }}
          />
          <CircularProgress
            variant="determinate"
            value={value}
            size={120}
            thickness={5}
            sx={{
              color,
              position: "absolute",
              left: 0,
            }}
          />
          <Box className="absolute inset-0 flex items-center justify-center">
            <Typography sx={{ fontSize: "22px", fontWeight: 700 }}>
              {value}%
            </Typography>
          </Box>
        </Box>
        {children}
        <Box className="flex gap-2 justify-center">
          <Button
            variant="contained"
            onClick={onApprove}
            size="small"
            sx={{
              backgroundColor: "#243B56",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#1e324c",
              },
            }}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            onClick={onReject}
            size="small"
            sx={{
              border: "1px solid #00000040",
              color: "#1e324c",
              "&:hover": {
                backgroundColor: "#ffeaea",
                borderColor: "#EF4444",
                color: "#EF4444",
              },
            }}
          >
            Reject
          </Button>
        </Box>
      </Box>
    </>
  );
}
