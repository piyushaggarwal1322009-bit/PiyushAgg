# Blindmark

Compare your numbers with your community, without anyone seeing yours.

## The problem

To know whether your internship stipend, freelance rate or rent is fair,
people have to share real numbers. Most sites ask you to simply trust them.

## The idea

Your browser splits your number into two random-looking pieces and sends
one piece to each of two independent servers. Each server adds up the
pieces it receives. Combining the two totals gives the group's real total,
but no server ever sees any individual number.

## Trust model

- Two independent operators run the servers. Your number stays private as
  long as at least one of them is honest.
- Results appear only after a minimum number of people have joined.
- Even group results can leak information in small groups, so we plan to
  add noise to the released results.

## Status

Early prototype. The toy in `toy/` runs both servers in one script, so it
is NOT private yet. Do not use it with real data.

## Roadmap

- [ ] Toy secret-sharing demo (`toy/secret_sharing.py`)
- [ ] Two separate aggregator services
- [ ] Browser client
- [ ] Minimum group size and noise
- [ ] One person, one submission
- [ ] Threat model
- [ ] First community pilot

## License

See the `LICENSE` file.
