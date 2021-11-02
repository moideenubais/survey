import { Box, Card, CardContent, CardHeader } from '@material-ui/core';
import React from 'react';

export default function SomethingWentWrong(props) {
  return (
    <div>
      <Card
        style={{
          width: 'fit-content',
          position: 'absolute',
          top: '50%',
          left: '50%'
        }}
      >
        <CardHeader title="Error" />
        <CardContent>
          <Box>
            {props.content ? props.content : 'Something went wrong.....'}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
