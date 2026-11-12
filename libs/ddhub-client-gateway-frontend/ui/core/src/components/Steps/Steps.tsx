import { Box } from '@mui/material';
import { Step } from './Step/Step';
import { TStep } from './Step/stepTypes';

export interface StepsProps {
  activeStep: number | string;
  setActiveStep?: (index: number | string) => void;
  steps: TStep[];
}

export const Steps = ({ activeStep, setActiveStep, steps }: StepsProps) => {
  return (
    <Box>
      {steps.map((step, index) => {
        return (
          <Step
            key={index}
            active={activeStep === index || activeStep === step.id}
            subtitle={step.subtitle}
            title={step.title}
            icon={step.icon}
            showCursor={!!setActiveStep && !step.disabled}
            disabled={step.disabled}
            clickHandler={() => {
              if (setActiveStep) {
                setActiveStep(step.id || index);
              }
            }}
          />
        );
      })}
    </Box>
  );
};
