const fs = require('fs');

const filePath = 'src/pages/dashboard/LessonPage.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const oldStr = `          {/* Right Column: Actions and Content */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* Homework Card */}
            {lesson.has_homework && !homeworkCompleted && (
              <div className="p-6 bg-orange-50 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-orange-100 flex flex-col gap-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg tracking-tight">Homework Required</h3>
                  </div>
        const fs = require('fs');

const filePath = 'ed