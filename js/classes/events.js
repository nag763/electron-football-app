function Events() {}

Events.fromResponse = function(response) {
  // Sort by desc time
  const event = response.data.api.events.sort(
      (a, b) => (b.elapsed - a.elapsed),
  );
  return event;
};
