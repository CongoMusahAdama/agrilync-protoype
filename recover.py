import re
import os

log_path = 'C:/Users/Duapa Werkspace 010/.gemini/antigravity/brain/3062fc21-5674-4d93-a734-750906e58eb3/.system_generated/logs/overview.txt'

with open(log_path, 'r', encoding='utf-8', errors='replace') as f:
    text = f.read()

def get_block(step_id):
    pattern = rf'Step Id: {step_id}\n.*?File Path: `file:///c:/Users/Duapa%20Werkspace%20010/Desktop/agrilync/agrilync-protoype/src/pages/AgentDashboard\.tsx`\n.*?The following code has been modified.*?\n(.*?)\nThe above content (does NOT show|shows)'
    match = re.search(pattern, text, re.DOTALL)
    if match:
        content = match.group(1)
        cleaned = re.sub(r'^\d+:\s', '', content, flags=re.MULTILINE)
        return cleaned.strip('\n').split('\n')
    return []

b1767 = get_block(1767) # 1-500
b1749 = get_block(1749) # 500-600
b1752 = get_block(1752) # 600-750
b1759 = get_block(1759) # 700-1000
b1746 = get_block(1746) # 1100-1188

if not b1767: print("Failed 1767")
if not b1749: print("Failed 1749")
if not b1752: print("Failed 1752")
if not b1759: print("Failed 1759")
if not b1746: print("Failed 1746")

with open('old_head.tsx', 'r', encoding='utf-16le', errors='replace') as f:
    old_text = f.read()
    if old_text.startswith('\ufeff'): old_text = old_text[1:]
    old_lines = old_text.splitlines()

# We need lines 1000-1100.
# In b1759, the last few lines are around line 1000.
# Let's see what is line 1000 in b1759
if b1759:
    last_line = b1759[-1]
    print("Last line of 1759:", last_line)
    
    # find last_line in old_lines
    idx = -1
    for i, l in enumerate(old_lines):
        if l.strip() == last_line.strip():
            idx = i
            break
            
    print("Found at", idx)
    first_line_of_1100 = b1746[0] if b1746 else None
    idx2 = -1
    if first_line_of_1100:
        for i, l in enumerate(old_lines):
            if l.strip() == first_line_of_1100.strip():
                idx2 = i
                break
        print("Found 1100 at", idx2)
        
    if idx != -1 and idx2 != -1:
        middle = old_lines[idx+1 : idx2]
        
        # reconstruct full file
        full = b1767[:499] + b1749[:100] + b1752[:100] + b1759 + middle + b1746
        with open('src/pages/AgentDashboard.tsx', 'w', encoding='utf-8') as out:
            out.write('\n'.join(full))
        print("RECONSTRUCTED WITH LENGTH", len(full))
