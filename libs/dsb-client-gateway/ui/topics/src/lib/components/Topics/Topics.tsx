import { FC, useState, useRef } from 'react';
import clsx from 'clsx';
import { Typography, Button, Chip, Menu, MenuItem, IconButton } from '@mui/material';
import { MoreVertical } from 'react-feather';
import { GetTopicDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { GenericTable } from '@dsb-client-gateway/ui/core';
import { useTopicsEffects } from './Topics.effects';
import { useStyles } from './Topics.styles';

interface CellProps {
  value: string[];
}

const Tags = ({ value }: CellProps) => {
  const { classes } = useStyles();
  return value.map((tag: string) => {
    return (
      <Chip
        color="primary"
        className={classes.chip}
        classes={{
          label: classes.chipLabel,
        }}
        label={tag}
      />
    );
  });
};

const Action = () => {
  const { classes } = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };


  return <>
  <IconButton onClick={handleClick} ref={anchorRef}>
  <MoreVertical style={{ width: '18px', stroke: '#B2B6BD'}}   />
  </IconButton>
  <Menu
        keepMounted
        anchorEl={anchorRef.current}
        open={open}
        onClose={handleClose}
        classes={{
          paper: classes.paper,
          list:  classes.list
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem className={classes.menuItem}>
        View details
        </MenuItem>
        <MenuItem className={classes.menuItem}>
        Update
        </MenuItem>
        <MenuItem className={classes.menuItem}>
        View version history
        </MenuItem>
        <MenuItem className={clsx(classes.menuItem, classes.error)}>
        Remove
        </MenuItem>
      </Menu>
  </>
};

export const TOPICS_HEADERS = [
  {
    Header: 'VERSION',
    accessor: 'version',
    cellBodyColor: '#A466FF',
  },
  {
    Header: 'TOPIC NAME',
    accessor: 'name',
  },
  {
    Header: 'SCHEMA TYPE',
    accessor: 'schemaType',
  },
  {
    Header: 'TAGS',
    accessor: 'tags',
    Cell: Tags,
  },
  {
    Header: '',
    accessor: 'id',
    hideHeader: true,
    width: 10,
    Cell: Action,
  },
];

export const Topics: FC = () => {
  const { classes } = useStyles();
  const { openCreateTopic, topics } = useTopicsEffects();

  console.log(topics, 'topics');

  const handleRowClick = (data: GetTopicDto) => {
    console.log(data);
  };

  return (
    <section className={classes.table}>
      <GenericTable<GetTopicDto>
        headers={TOPICS_HEADERS}
        tableRows={topics}
        onRowClick={handleRowClick}
      >
        <div className={classes.createTopicButtonWrapper}>
          <Button
            className={classes.createTopicButton}
            variant="contained"
            color="primary"
            onClick={openCreateTopic}
          >
            <Typography
              variant="body2"
              className={classes.createTopicButtonText}
            >
              Create
            </Typography>
          </Button>
        </div>
      </GenericTable>
    </section>
  );
};
