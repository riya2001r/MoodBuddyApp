export const moodToColor = {
  happy: '#A8E6CF',
  sad: '#FF8C94',
  angry: '#FFAAA5',
  neutral: '#FFD3B6',
};

export const convertMoodDataToMarkedDates = (moodLogs) => {
  const marked = {};
  moodLogs.forEach((log) => {
    marked[log.date] = {
      selected: true,
      selectedColor: moodToColor[log.emotion] || '#d3d3d3',
    };
  });
  return marked;
};
