import sys

path = r'src\pages\agent\TasksDashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old_block = '''                 <div className="flex items-center gap-3 text-xs text-gray-500 font-medium font-inter">
                    <div className="flex items-center gap-1.5">
                      <div className="h-6 w-6 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                         {task.farmer !== 'System' && <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${task.farmer}`} alt={task.farmer} />}
                      </div>
                      <span className="font-bold text-gray-700">{task.farmer}</span>
                    </div>
                    {task.farm !== 'N/A' && (
                      <>
                         <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                         <div className="flex items-center gap-1">
                           <MapPin className="h-3.5 w-3.5 text-gray-400" />
                           <span>{task.farm}</span>
                         </div>
                      </>
                    )}
                 </div>'''

new_block = '''                 <div className="flex items-center flex-wrap gap-3 text-xs text-gray-500 font-medium font-inter">
                    <div className="flex items-center gap-1.5">
                      <div className="h-6 w-6 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                         {task.farmer !== 'System' && <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${task.farmer}`} alt={task.farmer} />}
                      </div>
                      <span className="font-bold text-gray-700">{task.farmer}</span>
                    </div>
                    {task.location ? (
                      <>
                         <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                         <div className="flex items-center gap-1 text-[#065f46] font-semibold">
                           <MapPin className="h-3.5 w-3.5" />
                           <span>{task.location}</span>
                         </div>
                      </>
                    ) : task.farm !== 'N/A' ? (
                      <>
                         <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                         <div className="flex items-center gap-1">
                           <MapPin className="h-3.5 w-3.5 text-gray-400" />
                           <span>{task.farm}</span>
                         </div>
                      </>
                    ) : null}
                 </div>'''

if old_block in content:
    content = content.replace(old_block, new_block, 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS: location block updated')
else:
    print('ERROR: old block not found')
    # Try to find a partial match
    snippet = 'flex items-center gap-3 text-xs text-gray-500 font-medium font-inter'
    idx = content.find(snippet)
    print('Snippet found at char:', idx)
    print('Context:', repr(content[max(0,idx-20):idx+200]))
    sys.exit(1)
