import secrets
P = 2**61 - 1

def split(x):
    r = secrets.randbelow(P)
    return r, (x - r) % P

agg = [0, 0]
salaries = [52000, 61000, 48000, 75000]
for s in salaries:
    a, b = split(s)
    agg[0] = (agg[0] + a) % P
    agg[1] = (agg[1] + b) % P

print((agg[0] + agg[1]) % P / len(salaries))  # mean; no server saw a salary

