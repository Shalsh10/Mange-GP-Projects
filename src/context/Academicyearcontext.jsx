import { createContext, useContext, useState, useEffect } from "react";
import Admin from "../services/Admin.model";

const AcademicYearContext = createContext();

export function AcademicYearProvider({ children }) {
  const [academicYear, setAcademicYearState] = useState(() => {
    const currentYear = new Date().getFullYear();
    return currentYear; // fallback to current year
  });
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYearId, setSelectedYearId] = useState("");

  const loadAcademicYears = async () => {
    try {
      const response = await Admin.getAcademicYears();
      if (Array.isArray(response)) {
        setAcademicYears(response);
        const activeYear = response.find((year) => year.is_active === 1);
        if (activeYear) {
          const yearNum = parseInt(activeYear.code, 10);
          setAcademicYearState(isNaN(yearNum) ? activeYear.code : yearNum);
          setSelectedYearId(activeYear.id);
        }
      }
    } catch (error) {
      console.error("Failed to load academic years in context:", error);
    }
  };

  const setAcademicYear = (val) => {
    const num = parseInt(val, 10);
    setAcademicYearState(isNaN(num) ? val : num);
  };

  useEffect(() => {
    loadAcademicYears();
  }, []);

  return (
    <AcademicYearContext.Provider
      value={{
        academicYear,
        setAcademicYear,
        academicYears,
        selectedYearId,
        setSelectedYearId,
        loadAcademicYears,
      }}
    >
      {children}
    </AcademicYearContext.Provider>
  );
}

export const useAcademicYear = () => useContext(AcademicYearContext);
