# Changelog

## [1.1.1] - 2026-02-11

### Added

- `pre-push` 훅으로 브랜치 네이밍 규칙 강제 (`v{semver}/{type}/{description}`)
- PR 템플릿 개선 (Summary / Changes / Test Plan)

## [1.1.0] - 2026-02-09

### Changed

- **Yarn PnP 마이그레이션**: `nodeLinker`를 `node-modules`에서 `pnp`로 전환
- **Yarn 업그레이드**: 4.1.0 → 4.12.0
- **tsconfig extends**: 패키지 참조(`@orka-log/tsconfig/...`)에서 상대경로로 변경
- **Next.js build**: `--turbopack` 제거 (PnP 미지원, dev에서는 유지)

### Added

- TypeScript PnP SDK (`.yarn/sdks/typescript`)
- 루트 tsconfig references에 `apps/web`, `packages/ui` 추가
- `.gitignore` PnP 구조 적용
- WebStorm 에디터 지원 안내 추가

### Fixed

- `@orka-log/utils` debounce: `NodeJS.Timeout` → `ReturnType<typeof setTimeout>` (Node 타입 의존 제거)
- `@orka-log/utils` tsconfig: `lib`에 `DOM` 추가하여 `setTimeout`/`clearTimeout` 해석 수정
- Biome lint 오류 수정 (import 정렬, JSON 포맷팅)

---

## [1.0.0] - 2025-10-10

### Added

- Yarn Berry (v4) workspace 모노레포 구조
- TypeScript 전체 적용
- Biome 린터/포매터 (ESLint + Prettier 대체)
- Turbo 빌드 시스템
- Import 자동 정렬 (커스텀 그룹)
- 공유 패키지: `@orka-log/ui-components`, `@orka-log/utils`, `@orka-log/tsconfig`
- Next.js 15 웹 애플리케이션 (`@orka-log/web`)
- `@ziclo/create-next-boilerplate` CLI
- GitHub Actions CI/CD 파이프라인
- Husky + lint-staged 커밋 훅
