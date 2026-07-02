
export default function FinalReport() {
  return (
    <div> <div className="flex flex-col gap-6 w-full ">
      <div className="flex  w-full  justify-between">
        <div className="flex flex-col  justify-between basis-2/3">
          <MilestoneTabs />
          <Tasks />
          <Outlet />
        </div>
        <div className="flex flex-col justify-between">
          <TeamSelector />
<Card
  title="Overall Similarity"
  value={46}
  color="#FACC15"
>
  <Typography variant="caption" color="text.secondary">
    Scan Completed · Dec 28, 2025 · 10:45 pm
  </Typography>

  <Box className="text-xs flex justify-between">
    <span>Low: 0–30%</span>
    <span>Medium: 31–80%</span>
    <span>High: 81–100%</span>
  </Box>

  <Typography fontWeight={600}>
    Overall Risk Level: Medium
  </Typography>

  <Typography variant="body2">
    High visual similarity, low logic overlap.
    Suggesting oral discussion.
  </Typography>

  <Typography variant="caption" color="success.main">
    AI Confidence: 98%
  </Typography>
</Card>

        </div>
      </div>
    </div></div>
  )
}
