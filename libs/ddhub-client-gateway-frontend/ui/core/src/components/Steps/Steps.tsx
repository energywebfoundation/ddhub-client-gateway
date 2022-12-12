import { Box } from '@mui/material';
import { Step } from './Step/Step';
import { TStep } from './Step/stepTypes';

export interface StepsProps {
  activeStep: number;
  setActiveStep?: (index: number) => void;
  steps: TStep[];
}

export const Steps = ({ activeStep, setActiveStep, steps }: StepsProps) => {
  return (
    <Box>
      {steps.map((step, index) => {
        return (
          <Step
            key={index}
            active={activeStep === index}
            subtitle={step.subtitle}
            title={step.title}
            icon={step.icon}
            showCursor={!!setActiveStep}
            clickHandler={() => {
              if (setActiveStep) {
                setActiveStep(index);
              }
            }}
          />
        );
      })}
    </Box>
  );
};
