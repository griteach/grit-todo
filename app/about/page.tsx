export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Grit Todo 프로젝트 소개
          </h1>
          <p className="text-xl text-gray-600">
            Next.js와 TypeScript로 만든 현대적인 할 일 관리 애플리케이션
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            프로젝트 특징
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Next.js 14 App Router 사용
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              TypeScript로 타입 안전성 보장
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Tailwind CSS로 모던한 UI 디자인
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              반응형 디자인으로 모든 기기 지원
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            기술 스택
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                프론트엔드
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Next.js 14</li>
                <li>• React 18</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                개발 도구
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• ESLint</li>
                <li>• Prettier</li>
                <li>• PostCSS</li>
                <li>• shadcn/ui</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
