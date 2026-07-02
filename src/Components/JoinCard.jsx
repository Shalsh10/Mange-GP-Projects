import { Card, CardContent, Typography, Box } from "@mui/material";
import { Avatar, AvatarGroup } from "@mui/material";
import { TbCategoryPlus } from "react-icons/tb";
import { useState } from "react";
import { IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FaRegFileAlt } from "react-icons/fa";
import Modal from "@mui/material/Modal";
const JoinCard = ({
  name,
  department,
  description,
  members = [],
  category,
  projectPDF,
}) => {
  const [open, setOpen] = useState(false);
  const visibleMembers = members.slice(0, 4);
  const remaining = members.length - 4;
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, position: "relative" , overflow: "visible",}}>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">{name}</Typography>
        </Box>
        {/* department */}
        <Box
          sx={{
            display: "inline-block",
            backgroundColor: "#F1F7FF",
            color: "#0C5BC4",
            px: 2,
            py: 0.5,
            borderRadius: 2,
            fontSize: 13,
            fontWeight: 500,
            mt: 1,
          }}
        >
          {department}
        </Box>
        <Typography mt={2}>{description}</Typography>
        {/* members */}
        <Box mt={2} display="flex" alignItems="center" gap={1}>
          <AvatarGroup max={4}>
            {visibleMembers.map((member, index) => (
              <Avatar key={index} src={member.image} />
            ))}
          </AvatarGroup>
          {remaining > 0 && (
            <Box
              onClick={() => setOpen(true)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#D9D9D9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              +{remaining}
            </Box>
          )}
        </Box>

        {/* files */}
        <Box mt={2} display="flex" gap={1}>
          <FaRegFileAlt /> {projectPDF}
        </Box>

        <Box mt={2} display="flex" alignItems="center" gap={1}>
          <TbCategoryPlus /> {category}
        </Box>

        {/* ✅ Team Members Popup */}
        {open && (
<Modal
  open={open}
  onClose={() => setOpen(false)}
>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 350,
      bgcolor: "#fff",
      borderRadius: 2,
      boxShadow: 24,
      p: 2,
    }}
  >
    {/* header */}
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={1}
    >
      <Typography fontWeight={600}>Team Members</Typography>

      <IconButton size="small" onClick={() => setOpen(false)}>
        <CloseIcon />
      </IconButton>
    </Box>

    <Divider />

    {/* members list */}
    <Box mt={1} display="flex" flexDirection="column" gap={1}>
      {members.map((member, index) => (
        <Box key={index} display="flex" alignItems="center" gap={1}>
          <Avatar src={member.image} />

          <Box>
            <Typography fontSize={14}>
              {member.name || "Member Name"}
            </Typography>

            <Typography fontSize={12} color="gray">
              {member.role || "Frontend"}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
</Modal>
        )}
      </CardContent>
    </Card>
  );
};

export default JoinCard;
