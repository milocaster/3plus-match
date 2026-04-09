import re

with open('src/main.ts', 'r') as f:
    ts = f.read()

old_code = """    } else {
        initStage();
    }
};"""

new_code = """    } else {
        initStage();
        playAudio();
    }
};"""

if old_code in ts:
    ts = ts.replace(old_code, new_code)
    with open('src/main.ts', 'w') as f:
        f.write(ts)
    print("SUCCESS")
else:
    print("OLD CODE NOT FOUND")
