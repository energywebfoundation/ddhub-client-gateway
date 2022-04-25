import { Box } from '@mui/material';
import { Step } from './Step/Step';
import { CREATION_STEPS } from './models/creationSteps';

export interface StepsProps {
  activeStep: number;
  setActiveStep?: (index: number) => void;
}

export const Steps = ({ activeStep, setActiveStep }: StepsProps) => {
  return (
    <Box>
      {CREATION_STEPS.map((step, index) => {
        return (
          <Step
            key={index}
            active={activeStep === index}
            subtitle={step.subtitle}
            title={step.title}
            icon={step.icon}
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
