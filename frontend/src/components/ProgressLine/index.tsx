import React, { useEffect, useState } from "react";
import "./ProgressLine.css";

// Define types for the visualParts prop
interface VisualPart {
  percentage: string;
  color: string;
}

// Define types for the component props
interface ProgressLineProps {
  label: string;
  backgroundColor?: string;
  visualParts?: VisualPart[];
}

const ProgressLine: React.FC<ProgressLineProps> = ({
  label,
  backgroundColor = "#e5e5e5",
  visualParts = [
    {
      percentage: "0%",
      color: "white"
    }
  ]
}) => {
  // Starting values needed for the animation
  const [widths, setWidths] = useState<string[]>(
    visualParts.map(() => {
      return "0%"; // Initial width is 0% for each part
    })
  );

  useEffect(() => {
    // Using requestAnimationFrame to trigger animation
    requestAnimationFrame(() => {
      // Set a new array of percentage widths based on the props
      setWidths(
        visualParts.map(item => {
          return item.percentage;
        })
      );
    });
  }, [visualParts]);

  return (
    <>
      <div className="progressLabel">{label}</div>
      <div
        className="progressVisualFull"
        style={{
          backgroundColor
        }}
      >
        {visualParts.map((item, index) => {
          return (
            <div
              key={index}
              style={{
                width: widths[index],
                backgroundColor: item.color
              }}
              className="progressVisualPart"
            />
          );
        })}
      </div>
    </>
  );
};

export default ProgressLine;
