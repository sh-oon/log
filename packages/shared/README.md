# @sunghoon-log/shared

공유 유틸리티 함수 라이브러리입니다.

## 사용법

```ts
import { formatDate, debounce } from '@sunghoon-log/shared';

const today = formatDate(new Date());
const debouncedFn = debounce(() => console.log('실행!'), 300);
```

