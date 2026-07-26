import js from '@eslint/js'
import globals from 'globals'
import security from 'eslint-plugin-security'

/**
 * セキュリティルール中心の ESLint 設定（flat config）。
 *
 * TypeScript 7 は typescript-eslint のサポート範囲外(peer typescript <6.1.0)のため、
 * .ts/.tsx は ignores でリント対象外とする。型安全性は tsc、シークレット検出は
 * secret-scan(Trivy) で代替する。ESLint は .js/.jsx 等に security ルールを適用。
 * 参考: https://github.com/y-maeda1116/security-base
 */
export default [
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      '**/*.ts',
      '**/*.tsx',
    ],
  },
  js.configs.recommended,
  security.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    // recommended(全ルール warn) を踏襲しつつ、重要度を上げるものは error で上書き。
    // ※ eslint-plugin-security 4.x に存在しないルール名(detect-no-callback-in-promise 等)は
    //    旧 eslintrc に残っていた無効エントリのため除外した。
    rules: {
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-non-literal-regexp': 'error',
      'security/detect-pseudoRandomBytes': 'error',
    },
  },
]
