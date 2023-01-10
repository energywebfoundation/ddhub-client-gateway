import React from 'react';
import {Tabs as MuiTabs, Tab, Box, BoxProps} from '@mui/material';
import { useTabsEffects } from './Tabs.effects';
import { TabPanel } from './TabPanel/TabPanel';
import { useStyles } from './Tabs.styles';

export interface TabsProps {
  childrenProp?: React.ReactNode;
  label: string;
}

export function Tabs(props: { tabProps: TabsProps[], wrapperProps?: BoxProps }) {
  const { value, handleChange, a11yProps } = useTabsEffects();
  const { classes } = useStyles();

  return (
    <Box sx={{ width: '100%' }}>
      <Box pb={3.25}>
        <MuiTabs value={value} onChange={handleChange} aria-label="tabs">
          {props.tabProps.map((item, index) => (
            <Tab label={item.label} {...a11yProps(index)} key={index}
                 classes={{
                   root: classes.root
                 }}/>
          ))}
        </MuiTabs>
      </Box>
      {props.tabProps.map((item, index) => (
        <TabPanel value={value} index={index} key={index} {...props.wrapperProps}>
          {item.childrenProp}
        </TabPanel>
      ))}
    </Box>
  );
}

export default Tabs;
