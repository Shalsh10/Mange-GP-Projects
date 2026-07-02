import { FaPaperclip, FaChevronDown, FaLightbulb } from "react-icons/fa";
import "./uploadProjectIdea.css";
import { useEffect, useState } from "react";
import Project from "../Services/Project.model";
export default function UploadProjectIdea() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectTypes, setProjectTypes] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [leaderId, setLeaderId] = useState(null);
  const [tools, setTools] = useState(["Figma", "React", "Python", "Firebase"]);
  const [toolInput, setToolInput] = useState("");
  const [files, setFiles] = useState(null);
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("Software Engineering");
  const [form, setForm] = useState({
    title: "",
    description: "",
    problem_statement: "",
    solution: "",
    department_id: "",
    project_type_id: "",
    technologies: tools,
    leader_user_id: leaderId,
  });
  const handleFileChange = (e) => {
    setFiles(e.target.files[0]);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
const addTool = () => {
  if (!toolInput.trim()) return;

  setTools((prev) => [...prev, toolInput.trim()]);
  setToolInput("");
};
  useEffect(() => {
  setForm((prev) => ({
    ...prev,
    technologies: tools,
  }));
}, [tools]);
useEffect(() => {
  setForm((prev) => ({
    ...prev,
    attachment: files,
  }));
}, [files]);

useEffect(() => {
  setForm((prev) => ({
    ...prev,
    image: image,
  }));
}, [image]);
const handleSubmit = async () => {
  try {
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("problem_statement", form.problem_statement);
    formData.append("solution", form.solution);
    formData.append("department_id", form.department_id);
    formData.append("project_type_id", form.project_type_id);
    formData.append("leader_user_id", form.leader_user_id);

    formData.append("category", category); // 👈 هنا المهم

    formData.append("technologies", JSON.stringify(form.technologies));

    if (form.attachment) formData.append("attachment", form.attachment);
    if (form.image) formData.append("image", form.image);

    const res = await Project.uploadIdea(formData);

    console.log("Success:", res);

  } catch (error) {
    console.log("Submit error:", error);
  }
};
const removeTool = (index) => {
  setTools((prev) => prev.filter((_, i) => i !== index));
};
const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTool();
  }
};
useEffect(() => {
  setForm((prev) => ({
    ...prev,
    technologies: tools,
  }));
}, [tools]);
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const res = await Project.getFormData();

        const data = res;
        console.log("Form Data:", data);
        setTeamMembers(data.team_members);

        setLeaderId(data.team.leader_user_id);

        setDepartments(data.departments);
        setProjectTypes(data.project_types);
      } catch (error) {
        console.log("Error loading form data:", error);
      }
    };

    fetchFormData();
  }, []);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const res = await Project.getDepartments();
        setDepartments(res);
      } catch (error) {
        console.log("Error loading departments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);
  useEffect(() => {
    const fetchProjectTypes = async () => {
      try {
        const res = await Project.getProjectTypes();
        setProjectTypes(res);
      } catch (error) {
        console.log("Error loading project types:", error);
      }
    };

    fetchProjectTypes();
  }, []);
  return (
    <div className="upload-page">
      {/* Header */}
      <div className="upload-header">
        <div>
          <div className="title-row">
            <h1>Upload Project Idea</h1>
            <FaLightbulb className="bulb-icon" />
          </div>

          <p>Start your graduation project by submitting your ideas.</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="upload-card">
        <div className="form-grid">
          {/* LEFT SIDE */}
          <div className="form-column">
            <div className="field-group">
              <label>
                Project Title <span>*</span>
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="field-group">
              <label>
                Project Description <span>*</span>
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="field-group">
              <label>
                Problem Statement <span>*</span>
              </label>

              <textarea
                value={form.problem_statement}
                onChange={(e) =>
                  setForm({ ...form, problem_statement: e.target.value })
                }
              />
            </div>

            <div className="field-group">
              <label>
                Department <span>*</span>
              </label>
              <div className="select-wrapper">
                <select
                  value={form.department_id}
                  onChange={(e) =>
                    setForm({ ...form, department_id: e.target.value })
                  }
                >
                  {loading ? (
                    <option>Loading...</option>
                  ) : (
                    departments.map((dep) => (
                      <option key={dep.id} value={dep.id}>
                        {dep.name}
                      </option>
                    ))
                  )}
                </select>

                <FaChevronDown className="select-icon" />
              </div>
            </div>

            <div className="field-group">
              <label>
                Proposed Solution / Objectives <span>*</span>
              </label>
              <textarea
                value={form.solution}
                onChange={(e) => setForm({ ...form, solution: e.target.value })}
              />
            </div>

            <div className="field-group">
              <label>Project Type</label>

              <div className="select-wrapper">
                <select
                  value={form.project_type_id}
                  onChange={(e) =>
                    setForm({ ...form, project_type_id: e.target.value })
                  }
                >
                  <option value="">Select Project Type</option>

                  {projectTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>

                <FaChevronDown className="select-icon" />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="form-column">
            <div className="field-group">
              <label>
                Team Leader <span>*</span>
              </label>

              <div className="select-wrapper">
                <select
                  value={form.leader_user_id}
                  onChange={(e) =>
                    setForm({ ...form, leader_user_id: e.target.value })
                  }
                >
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>

                <FaChevronDown className="select-icon" />
              </div>
            </div>

            <div className="field-group">
              <label>
                Category <span>*</span>
              </label>

              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category"
              />
            </div>
<div className="field-group">
  <label>
    Tools / Technologies <span>*</span>
  </label>

  {/* input wrapper */}
  <div className="relative flex items-center rounded px-2 py-1 bg-white focus-within:ring-2 focus-within:ring-blue-200">
    
    <input
      type="text"
      value={toolInput}
      onChange={(e) => setToolInput(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Add tool like React..."
      className="flex-1 outline-none p-2"
    />

    <button
      type="button"
      onClick={addTool}
      className="ml-2 px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition"
    >
      Add
    </button>
  </div>

  {/* tags */}
  <div className="flex flex-wrap gap-2 mt-2">
    {tools.map((tool, index) => (
      <span
        key={index}
        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
      >
        {tool}

        <button
          type="button"
          onClick={() => removeTool(index)}
          className="text-red-500"
        >
          ✕
        </button>
      </span>
    ))}
  </div>
</div>
            <div className="field-group">
              <label>Attach Files (if any):</label>

              <label className="upload-box cursor-pointer flex items-center gap-3">
                <FaPaperclip className="text-gray-600" />

                <span>
                  {files
                    ? files.name
                    : "Drag & drop your file here or click to upload"}
                </span>

                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="field-group">
              <label>Project Picture:</label>

              <label className="upload-box cursor-pointer flex items-center gap-3">
                <FaPaperclip className="text-gray-600" />

                <span>
                  {image
                    ? image.name
                    : "Drag & drop picture here or click to upload"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="submit-wrapper">
         <button className="submit-btn" onClick={handleSubmit}>
  Submit
</button>
        </div>
      </div>
    </div>
  );
}
