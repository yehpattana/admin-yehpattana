import Grid from '@mui/material/Unstable_Grid2';

export default function ColorPick() {
  return (
    <Grid md={6} xs={12}>
      <label htmlFor="color">Colors</label>
      <br />
      {color
        .filter((c) => c !== 'all')
        .map((c) => {
          return (
            <button
              style={{
                background: c !== 'all' ? c : undefined,
                margin: '3px',
                width: '35px',
                height: '35px',
                border: 'none',
              }}
            >
              {}
            </button>
          );
        })}
    </Grid>
  );
}
const color = ['all', '#ff0000', '#00ff00', '#0000ff', '#000', '#ffb900'];
