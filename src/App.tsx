import React, { useState, useRef } from "react";
import "./App.css";
import {
  FormResponse,
  FormSection,
  FormField,
  FormValues,
  ValidationError,
} from "./types";

const App: React.FC = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formStructure, setFormStructure] = useState<FormResponse | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [validationErrors, setValidationErrors] = useState<ValidationError>({});
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );
  const [fetchFormError, setFetchFormError] = useState<string | null>(null);
  const [sectionTransitionClass, setSectionTransitionClass] = useState("");
  const currentSectionRef = useRef<HTMLDivElement>(null);

  const handleRegister = async () => {
    try {
      const response = await fetch(
        "https://dynamic-form-generator-9rl7.onrender.com/create-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rollNumber, name }),
        }
      );

      if (response.ok) {
        setRegistrationError(null);
        await handleLogin();
      } else {
        const errorData = await response.json();
        setRegistrationError(errorData.message || "Registration failed");
      }
    } catch (error: any) {
      setRegistrationError("Failed to connect to the registration service.");
      console.error("Registration error:", error);
    }
  };

  const handleLogin = async () => {
    if (!rollNumber) {
      alert("Please enter your Roll Number to login.");
      return;
    }
    try {
      const response = await fetch(
        `https://dynamic-form-generator-9rl7.onrender.com/get-form?rollNumber=${rollNumber}`
      );
      if (response.ok) {
        const data: FormResponse = await response.json();
        setFormStructure(data);
        setIsLoggedIn(true);
        setFetchFormError(null);
        setFormValues({}); // Reset form values on new login
        setCurrentSectionIndex(0); // Reset to the first section
        setValidationErrors({}); // Clear previous validation errors
      } else {
        const errorData = await response.json();
        setFetchFormError(errorData.message || "Failed to fetch form data.");
        setIsLoggedIn(false);
        setFormStructure(null);
      }
    } catch (error: any) {
      setFetchFormError("Failed to connect to the form data service.");
      setIsLoggedIn(false);
      setFormStructure(null);
      console.error("Fetch form error:", error);
    }
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldId]: value,
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [fieldId]: "",
    }));
  };

  const validateField = (field: FormField, value: any): string | undefined => {
    if (field.required && !value) {
      return field.validation?.message || `${field.label} is required.`;
    }
    if (field.minLength && String(value).length < field.minLength) {
      return (
        field.validation?.message ||
        `${field.label} must be at least ${field.minLength} characters long.`
      );
    }
    if (field.maxLength && String(value).length > field.maxLength) {
      return (
        field.validation?.message ||
        `${field.label} must be at most ${field.maxLength} characters long.`
      );
    }
    if (field.type === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
      return field.validation?.message || "Invalid email format.";
    }
    if (field.type === "tel" && value && !/^[0-9]*$/.test(value)) {
      return field.validation?.message || "Invalid phone number format.";
    }
    return undefined;
  };

  const validateSection = (section: FormSection): ValidationError => {
    const errors: ValidationError = {};
    section.fields.forEach((field) => {
      const value = formValues[field.fieldId];
      const error = validateField(field, value);
      if (error) {
        errors[field.fieldId] = error;
      }
    });
    return errors;
  };

  const handleNextSection = () => {
    if (!formStructure) return;
    const currentSection = formStructure.form.sections[currentSectionIndex];
    const errors = validateSection(currentSection);
    setValidationErrors(errors);
    if (
      Object.keys(errors).length === 0 &&
      currentSectionIndex < formStructure.form.sections.length - 1
    ) {
      setSectionTransitionClass("form-section-slide-out");
      setTimeout(() => {
        setCurrentSectionIndex((prevIndex) => prevIndex + 1);
        setSectionTransitionClass("form-section-slide-in");
      }, 300); // Match the animation duration
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setSectionTransitionClass("form-section-slide-out");
      setTimeout(() => {
        setCurrentSectionIndex((prevIndex) => prevIndex - 1);
        setSectionTransitionClass("form-section-slide-in");
      }, 300); // Match the animation duration
    }
  };

  const handleSubmit = () => {
    if (!formStructure) return;
    const currentSection = formStructure.form.sections[currentSectionIndex];
    const errors = validateSection(currentSection);
    setValidationErrors(errors);
    if (Object.keys(errors).length === 0) {
      console.log("Form Data:", formValues);
      alert("Form submitted! Check the console for data.");
    }
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.fieldId,
      "data-testid": field.dataTestId,
      placeholder: field.placeholder,
      required: field.required,
      className: "form-control",
      value: formValues[field.fieldId] || "",
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => handleInputChange(field.fieldId, e.target.value),
    };

    switch (field.type) {
      case "text":
      case "tel":
      case "email":
      case "date":
        return (
          <input
            type={field.type}
            {...commonProps}
            maxLength={field.maxLength}
            minLength={field.minLength}
          />
        );
      case "textarea":
        return (
          <textarea
            {...commonProps}
            maxLength={field.maxLength}
            minLength={field.minLength}
          />
        );
      case "dropdown":
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option
                key={option.value}
                value={option.value}
                data-testid={option.dataTestId}
              >
                {option.label}
              </option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div>
            {field.options?.map((option) => (
              <div key={option.value} className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name={field.fieldId}
                  value={option.value}
                  checked={formValues[field.fieldId] === option.value}
                  onChange={() =>
                    handleInputChange(field.fieldId, option.value)
                  }
                  data-testid={option.dataTestId}
                />
                <label className="form-check-label">{option.label}</label>
              </div>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div>
            {field.options?.map((option) => (
              <div key={option.value} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  value={option.value}
                  checked={
                    Array.isArray(formValues[field.fieldId])
                      ? formValues[field.fieldId].includes(option.value)
                      : false
                  }
                  onChange={(e) => {
                    const currentValue = formValues[field.fieldId] || [];
                    const newValue = e.target.checked
                      ? [...currentValue, option.value]
                      : currentValue.filter((v: string) => v !== option.value);
                    handleInputChange(field.fieldId, newValue);
                  }}
                  data-testid={option.dataTestId}
                />
                <label className="form-check-label">{option.label}</label>
              </div>
            ))}
          </div>
        );
      default:
        return <p>Unknown field type: {field.type}</p>;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container mt-5">
        <h2>Student Login</h2>
        {registrationError && (
          <div className="alert alert-danger">{registrationError}</div>
        )}
        <div className="mb-3">
          <label htmlFor="rollNumber" className="form-label">
            Roll Number:
          </label>
          <input
            type="text"
            className="form-control"
            id="rollNumber"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button className="btn btn-primary me-2" onClick={handleLogin}>
          Login
        </button>
        <button className="btn btn-success" onClick={handleRegister}>
          Register
        </button>
        {fetchFormError && (
          <div className="alert alert-danger mt-3">{fetchFormError}</div>
        )}
      </div>
    );
  }

  if (!formStructure || !formStructure.form) {
    return <div className="container mt-5">Loading form...</div>;
  }

  const currentSection = formStructure.form.sections[currentSectionIndex];
  const isLastSection =
    currentSectionIndex === formStructure.form.sections.length - 1;

  return (
    <div className="container mt-4">
      <h2>{formStructure.form.formTitle}</h2>
      <div
        key={currentSection.sectionId}
        className={`form-section ${sectionTransitionClass}`}
        ref={currentSectionRef}
      >
        <h3>{currentSection.title}</h3>
        <p>{currentSection.description}</p>
        {currentSection.fields.map((field) => (
          <div key={field.fieldId} className="mb-3">
            <label htmlFor={field.fieldId} className="form-label">
              {field.label}
              {field.required && <span className="text-danger">*</span>}
            </label>
            {renderField(field)}
            {validationErrors[field.fieldId] && (
              <div className="text-danger">
                {validationErrors[field.fieldId]}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-between">
        {currentSectionIndex > 0 && (
          <button className="btn btn-secondary" onClick={handlePrevSection}>
            Previous
          </button>
        )}
        {isLastSection ? (
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleNextSection}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
