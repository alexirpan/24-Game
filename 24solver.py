from operator import add,mul,div,sub
ops = [add,mul,div,sub]

def solvable(nums):
    if len(nums) == 1:
        return round(nums[0]) == 24
    # Combine every possible choice of 2 numbers with an operation
    # include decimals
    for i in range(len(nums)-1):
        for j in range(i+1, len(nums)):
            for op in ops:
                a,b = nums[i], nums[j]
                next = list(nums)
                next.remove(a)
                next.remove(b)
                try:
                    next.append(op(a, b))
                    if solvable(next):
                        return True
                except ZeroDivisionError:
                    # hacky as hell
                    next.append(a)
                try:
                    next = next[:-1] + [op(b, a)]
                    if solvable(next):
                        return True
                except ZeroDivisionError:
                    pass
    return False
    
for a in range(1, 14):
    for b in range(a, 14):
        for c in range(b, 14):
            for d in range(c, 14):
                if solvable([float(a), float(b), float(c), float(d)]):
                    print "%d %d %d %d" % (a,b,c,d)