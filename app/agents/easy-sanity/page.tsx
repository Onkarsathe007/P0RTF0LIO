import type { ReactNode } from 'react'
import { styles } from '../../styles'
import DocsSidebar from './docs-sidebar'

type ToolListItem = { name: string; description: string; details?: string[] }
type ToolTuple = [string, string]

const navGroups = [
  {
    title: 'Getting Started',
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'architecture', label: 'Architecture' },
      { id: 'installation', label: 'Installation' },
      { id: 'configuration', label: 'Configuration' },
    ],
  },
  {
    title: 'Core Systems',
    items: [
      { id: 'data-artifacts', label: 'Data & Artifacts' },
      { id: 'reporting-memory', label: 'Reporting & Memory' },
      { id: 'tasks-profiles', label: 'Tasks & Profiles' },
    ],
  },
  {
    title: 'Tool Reference',
    items: [
      { id: 'session-tools', label: 'Session Tools' },
      { id: 'inspection-tools', label: 'Inspection Tools' },
      { id: 'interaction-tools', label: 'Interaction Tools' },
      { id: 'wait-tools', label: 'Wait Tools' },
      { id: 'extraction-tools', label: 'Extraction Tools' },
      { id: 'assertion-tools', label: 'Assertion Tools' },
      { id: 'task-tools', label: 'Task Tools' },
      { id: 'profile-tools', label: 'Profile Tools' },
      { id: 'memory-tools', label: 'App Memory Tools' },
    ],
  },
  {
    title: 'Operational Guidance',
    items: [
      { id: 'examples', label: 'Example Workflows' },
      { id: 'best-practices', label: 'Usage Guidance' },
      { id: 'security', label: 'Security' },
      { id: 'strengths-limitations', label: 'Strengths & Limits' },
      { id: 'related-docs', label: 'Related Docs' },
      { id: 'summary', label: 'Summary' },
    ],
  },
]

const capabilityAreas = [
  'Browser session lifecycle management',
  'Semantic browser actions',
  'Explicit assertions',
  'Synchronization and wait tools',
  'Extraction tools for tables, lists, links, and JSON-like page data',
  'Evidence capture through screenshots and markdown reports',
  'Reusable tasks and slash-command workflows',
  'Variable rendering and environment profiles',
  'Structured task definitions',
  'Persistent repo understanding and testing memory',
]

const architectureModules: ToolTuple[] = [
  ['main.py', 'Thin MCP entrypoint. Registers task tools, browser tools, and memory tools.'],
  ['browser/', 'Browser session state, browser tools, semantic domain understanding, and report generation.'],
  ['tasks/', 'Saved task system, structured tasks, sample tasks, task rendering, task linting, and profile management.'],
  ['memory/', 'Persistent repo understanding, app memory, testing briefs, and sync-driven learned notes.'],
  ['config/', 'Runtime configuration and environment-backed paths/defaults.'],
  ['prompts/', 'LLM-facing prompt text and reusable prompt templates.'],
  ['data/', 'Saved tasks, profiles, sample tasks, and app memory artifacts.'],
  ['artifacts/', 'Generated screenshots, downloads, and markdown reports.'],
]

const envRows: [string, string, string][] = [
  ['BROWSER_HEADLESS_DEFAULT', 'Whether `browser_start` runs headless by default', 'false'],
  ['BROWSER_DEFAULT_TIMEOUT_MS', 'Default Playwright timeout in milliseconds', '30000'],
  ['BROWSER_REPORTS_DIR', 'Directory for markdown test reports', 'artifacts/reports'],
  ['BROWSER_SCREENSHOTS_DIR', 'Directory for per-step screenshots', 'artifacts/screenshots'],
  ['BROWSER_DOWNLOADS_DIR', 'Directory for downloaded files', 'artifacts/downloads'],
  ['APP_MEMORY_DIR', 'Directory for persistent app-understanding memory', 'data/app_memory'],
  ['EASY_SANITY_HOME', 'Base directory used by installed builds for user-owned runtime data', 'platform-specific app data dir'],
]

const sessionTools = [
  {
    name: 'browser_start(task, headless=None)',
    description: 'Starts a new browser session.',
    details: [
      'Begin a browser workflow',
      'Optionally override headless mode',
      'Initialize report, screenshot, and download directories for the session',
    ],
  },
  {
    name: 'browser_stop(final_result=None)',
    description: 'Ends the browser session and writes the final report.',
    details: [
      'Close the browser cleanly',
      'Finalize action history',
      'Generate the markdown run report',
      'Return report and screenshot paths',
    ],
  },
  {
    name: 'browser_get_history()',
    description: 'Returns session action history.',
    details: ['Action list', 'Semantic change summaries', 'Route context', 'Report path', 'Screenshot directory'],
  },
]

const inspectionTools = [
  {
    name: 'browser_get_state()',
    description: 'Returns the current page state.',
    details: ['URL', 'Title', 'Visible text', 'Interactive elements', 'Screenshot as base64', 'Semantic page summary', 'Route context', 'Recent semantic change summary'],
  },
  {
    name: 'browser_get_dom_summary()',
    description: 'Returns a semantic page understanding summary.',
    details: ['Understanding forms', 'Understanding cards and tables', 'Identifying dialogs, alerts, headings, and workflow step context'],
  },
  {
    name: 'browser_get_accessibility_tree()',
    description: 'Returns a simplified accessibility-oriented tree of interactive elements.',
    details: ['Robust role/name-based interaction', 'Accessibility-friendly selectors'],
  },
  {
    name: 'browser_list_forms()',
    description: 'Returns visible forms and their fields.',
    details: ['Labels', 'Names', 'Placeholders', 'Required flags', 'Disabled state', 'Submit buttons'],
  },
  {
    name: 'browser_list_links()',
    description: 'Returns visible links on the page.',
    details: ['Navigation validation', 'Crawl-like sanity workflows'],
  },
  {
    name: 'browser_list_network_errors()',
    description: 'Returns failed network requests and error-level console messages seen during the session.',
  },
  {
    name: 'browser_get_console_logs(level="")',
    description: 'Returns session console logs.',
    details: ['Optional filter: error', 'Optional filter: warning', 'Optional filter: log'],
  },
  {
    name: 'browser_get_requests(limit=100)',
    description: 'Returns recent request and response activity captured for the page.',
  },
  {
    name: 'browser_get_storage()',
    description: 'Returns browser storage details.',
    details: ['Cookies', 'localStorage', 'sessionStorage'],
  },
  {
    name: 'browser_describe_changes()',
    description: 'Compares the current page to the last semantic snapshot and describes what changed.',
    details: ['Confirming route changes', 'Workflow-step changes', 'Dialog openings', 'Alert changes'],
  },
]

const interactionTools: ToolTuple[] = [
  ['browser_navigate(url)', 'Navigates to a URL and waits for page load/network idle behavior.'],
  ['browser_find_element(description, limit=5)', 'Finds likely interactive elements using a natural-language description. Useful prompts include `email field`, `login button`, and `search input`.'],
  ['browser_click(selector=None, text=None, element_index=None)', 'Low-level click tool supporting CSS selector click, visible text click, and `browser_get_state()` element index click.'],
  ['browser_click_by_role(role, name, exact=False)', 'Clicks an element by accessible role and name. Examples include a button named `Login` or a link named `Dashboard`.'],
  ['browser_click_by_label(name)', 'Clicks an element by human-readable label or visible name.'],
  ['browser_fill(field, text, press_enter=False)', 'Fills a field semantically using label, placeholder, name, id, `data-testid`, and fallback aria/attribute matching.'],
  ['browser_select_option(label, value)', 'Selects a value in a select/dropdown control using a semantic field label.'],
  ['browser_type(selector, text, press_enter=False)', 'Low-level typed input by CSS selector.'],
  ['browser_press_key(key)', 'Presses a keyboard key such as `Enter`, `Escape`, or `Tab`.'],
  ['browser_hover(selector)', 'Hovers over an element by selector.'],
  ['browser_drag_and_drop(source, target)', 'Performs drag-and-drop between two selectors.'],
  ['browser_upload_file(selector, path)', 'Uploads a local file into a file input.'],
  ['browser_download_file(link_or_selector)', 'Triggers a download and stores the file under the session download directory.'],
  ['browser_refresh()', 'Refreshes the current page.'],
  ['browser_go_back()', 'Moves backward in browser history.'],
  ['browser_go_forward()', 'Moves forward in browser history.'],
  ['browser_open_tab(url="")', 'Opens a new tab and optionally navigates it.'],
  ['browser_switch_tab(index=-1, title="")', 'Switches the active tab by index or title substring.'],
  ['browser_close_tab()', 'Closes the current tab and switches to another open tab.'],
  ['browser_scroll(direction="down", amount=500)', 'Scrolls the page up or down.'],
  ['browser_wait(seconds=2)', 'Simple fixed wait helper. Useful for animation and unstable UI, though smarter wait tools are preferred when possible.'],
]

const waitTools: ToolTuple[] = [
  ['browser_wait_for_text(text, timeout_ms=10000)', 'Waits until visible text appears.'],
  ['browser_wait_for_element(selector, timeout_ms=10000, state="visible")', 'Waits for an element to reach a given state such as `visible`, `attached`, `hidden`, or `detached`.'],
  ['browser_wait_for_url(pattern, timeout_ms=10000)', 'Waits until the current URL matches a substring pattern.'],
  ['browser_wait_for_navigation(timeout_ms=10000)', 'Waits until page navigation/load completes.'],
  ['browser_wait_for_network_idle(timeout_ms=10000)', 'Waits until Playwright reports network-idle state.'],
  ['browser_wait_for_disappearance(selector, timeout_ms=10000)', 'Waits until an element disappears or becomes hidden.'],
]

const extractionTools: ToolTuple[] = [
  ['browser_extract(selector)', 'Extracts text from a specific element.'],
  ['browser_extract_table(selector)', 'Extracts table headers and row data.'],
  ['browser_extract_list(selector)', 'Extracts items from a list-like container.'],
  ['browser_extract_json_from_page()', 'Extracts JSON-like page data from JSON script tags and common framework globals.'],
  ['browser_extract_links()', 'Extracts link text and URLs from the page.'],
  ['browser_capture_section(selector)', 'Captures the section text and a base64 screenshot of that section.'],
  ['browser_compare_text(selector, expected)', 'Compares an element’s text to an expected value and returns pass/fail data.'],
]

const assertionTools: ToolTuple[] = [
  ['assert_url_contains(expected_text)', 'Asserts the current URL contains a substring.'],
  ['assert_url_equals(expected_url)', 'Asserts the current URL exactly matches a value.'],
  ['assert_page_title(expected_text)', 'Asserts the page title contains the expected text.'],
  ['assert_text_visible(text)', 'Asserts specific text is visible on the page.'],
  ['assert_text_not_visible(text)', 'Asserts specific text is not visible.'],
  ['assert_text_contains(text)', 'Asserts the body text contains a string.'],
  ['assert_text_matches(pattern)', 'Asserts the visible page text matches a regex pattern.'],
  ['assert_element_exists(selector)', 'Asserts an element exists.'],
  ['assert_element_visible(selector)', 'Asserts an element exists and is visible.'],
  ['assert_element_hidden(selector)', 'Asserts an element is hidden or absent.'],
  ['assert_element_enabled(selector)', 'Asserts an element exists and is enabled.'],
  ['assert_input_value(selector, expected)', 'Asserts an input/select/textarea has the expected current value.'],
  ['assert_count(selector, expected)', 'Asserts a selector matches an exact number of elements.'],
  ['assert_no_console_errors()', 'Asserts no error-level console messages were captured in the session.'],
  ['assert_no_failed_requests()', 'Asserts no failed requests were captured in the session.'],
  ['assert_screenshot_stable(selector="body")', 'Takes two short-interval screenshots and asserts they are identical. Useful for checking visual stability and detecting still-changing UI.'],
]

const taskTools: ToolTuple[] = [
  ['task_create(name, prompt, description="")', 'Creates a reusable saved task and registers it as a slash-command-style prompt.'],
  ['task_create_structured(...)', 'Creates a structured task definition with fields such as purpose, steps, assertions, inputs, retry policy, and expected result.'],
  ['task_preview_structured(...)', 'Previews a structured task without saving it.'],
  ['task_list()', 'Lists saved tasks.'],
  ['task_get(name)', 'Returns the full definition of a saved task.'],
  ['task_delete(name)', 'Deletes a saved task.'],
  ['task_render(name, profile="", variables_json="{}", mask_secrets=False)', 'Renders a templated task with merged variables. Precedence is explicit variables, then profile values, then environment variables.'],
  ['task_lint(name="", prompt="")', 'Lints a task prompt for vagueness, missing URL, missing verification, hardcoded secret-like content, and missing structure.'],
  ['task_wizard_template(goal, start_url="", include_placeholders=True, include_assertions=True)', 'Generates a starter task draft from a goal.'],
  ['sample_tasks_list()', 'Lists bundled sample tasks.'],
  ['sample_tasks_import(names_json="[]", overwrite=False)', 'Imports bundled sample tasks into saved tasks.'],
]

const profileTools: ToolTuple[] = [
  ['profile_save(name, variables_json, description="")', 'Creates or updates a reusable variable profile.'],
  ['profile_list()', 'Lists all profiles.'],
  ['profile_get(name, mask_secrets=True)', 'Returns a profile, optionally masking secrets.'],
  ['profile_delete(name)', 'Deletes a profile.'],
]

const memoryTools: ToolTuple[] = [
  ['app_memory_sync(repo_path, app_name="", focus="", max_files=250)', 'Scans a target repository and builds or updates a persistent understanding map.'],
  ['app_memory_get(repo_path)', 'Returns stored memory for a repo.'],
  ['app_memory_add_note(repo_path, note, category="workflow")', 'Adds a manual persistent note to the memory map.'],
  ['app_memory_testing_brief(repo_path, goal="")', 'Builds a test-oriented brief from stored repo understanding.'],
  ['app_memory_list()', 'Lists all persisted repo memory entries.'],
]

const uvxInstallBrowserCode = `uvx easy-sanity install-browser`

const uvxLaunchCode = `uvx easy-sanity`

const pipxInstallCode = `pipx install easy-sanity
easy-sanity install-browser`

const sourceSetupCode = `./scripts/setup.sh`

const sourceManualSetupCode = `curl -LsSf https://astral.sh/uv/install.sh | sh
uv sync
uv run easy-sanity install-browser
uv run easy-sanity`

const codexConfigCode = `{
  "mcpServers": {
    "easy-sanity": {
      "command": "uvx",
      "args": ["easy-sanity"],
      "env": {
        "BROWSER_HEADLESS_DEFAULT": "true",
        "BROWSER_DEFAULT_TIMEOUT_MS": "45000",
        "BROWSER_REPORTS_DIR": "artifacts/reports",
        "BROWSER_SCREENSHOTS_DIR": "artifacts/screenshots",
        "BROWSER_DOWNLOADS_DIR": "artifacts/downloads",
        "APP_MEMORY_DIR": "data/app_memory"
      }
    }
  }
}`

const pipxConfigCode = `{
  "mcpServers": {
    "easy-sanity": {
      "command": "easy-sanity",
      "args": [],
      "env": {
        "BROWSER_HEADLESS_DEFAULT": "true",
        "BROWSER_DEFAULT_TIMEOUT_MS": "45000"
      }
    }
  }
}`

const claudeCursorClineConfigCode = `{
  "mcpServers": {
    "browser-automation": {
      "command": "easy-sanity",
      "args": [],
      "env": {
        "BROWSER_HEADLESS_DEFAULT": "true",
        "BROWSER_DEFAULT_TIMEOUT_MS": "45000"
      }
    }
  }
}`

const sourceRunCode = `uv run easy-sanity`

const pathsCode = `easy-sanity paths

uv run easy-sanity paths`

const troubleshootBrowserCode = `easy-sanity install-browser

uvx easy-sanity install-browser`

export const metadata = {
  title: 'Easy Sanity Documentation - Kedar Vartak',
  description: 'Embedded product documentation for the Easy Sanity regression testing agent.',
}

function DocSection({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} style={styles.docsSection}>
      <p style={styles.docsEyebrow}>{eyebrow}</p>
      <h2 style={styles.docsSectionTitle}>{title}</h2>
      <div style={styles.docsSectionBody}>{children}</div>
    </section>
  )
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div style={styles.docsCodeShell}>
      <div style={styles.docsCodeLabel}>{label}</div>
      <pre style={styles.docsPre}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

function ToolList({
  tools,
  columns = 1,
}: {
  tools: ToolListItem[] | ToolTuple[]
  columns?: number
}) {
  const normalized = tools.map((tool) =>
    Array.isArray(tool) ? { name: tool[0], description: tool[1], details: undefined } : tool
  )

  return (
    <div
      style={{
        ...styles.docsToolGrid,
        gridTemplateColumns: columns === 2 ? 'repeat(2, minmax(0, 1fr))' : '1fr',
      }}
      className={columns === 2 ? 'docs-tool-grid-two' : undefined}
    >
      {normalized.map((tool) => (
        <article key={tool.name} style={styles.docsToolCard}>
          <h3 style={styles.docsToolName}>{tool.name}</h3>
          <p style={styles.docsToolDescription}>{tool.description}</p>
          {tool.details?.length ? (
            <ul style={styles.docsBulletList}>
              {tool.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </div>
  )
}

export default function EasySanityDocsPage() {
  return (
    <div style={{ ...styles.container, ...styles.docsPageContainer }} className="layout-container docs-page-container">
      <main style={styles.docsMain} className="docs-main">
        <div className="docs-mobile-message">
          <p>Docs should be viewed from a larger screen.</p>
        </div>

        <div style={styles.docsShell} className="docs-shell docs-desktop-shell">
          <DocsSidebar navGroups={navGroups} />

          <div style={styles.docsContent}>
            <section style={styles.docsHero}>
              <p style={styles.docsEyebrow}>Documentation</p>
              <h2 style={styles.docsTitle}>Easy Sanity Agent Documentation</h2>
              <p style={styles.docsLead}>
                Full reference for the Easy Sanity agent: what it is, how it works, how to install it, how to configure it,
                how to use it, what it stores, and every MCP tool it exposes.
              </p>
            </section>

            <DocSection id="overview" eyebrow="Overview" title="What Easy Sanity is">
              <p style={styles.docsParagraph}>
                Easy Sanity is a local browser automation and sanity-testing MCP server. It sits between your IDE agent and
                a real Chromium browser driven by Playwright.
              </p>
              <p style={styles.docsParagraph}>It is designed to let an IDE agent such as Codex use natural language to:</p>
              <ul style={styles.docsBulletList}>
                <li>Open and inspect web applications</li>
                <li>Interact with forms, buttons, dropdowns, dialogs, tables, and cards</li>
                <li>Verify app behavior with explicit assertions</li>
                <li>Capture screenshots, reports, and action history</li>
                <li>Save reusable workflows as slash-command style tasks</li>
                <li>Build persistent application understanding from a target code repository</li>
              </ul>
              <div style={styles.docsCallout}>
                <h3 style={styles.docsCalloutTitle}>Core idea</h3>
                <ol style={styles.docsNumberList}>
                  <li>You ask the IDE agent to perform or validate a browser workflow.</li>
                  <li>The IDE agent calls Easy Sanity MCP tools.</li>
                  <li>Easy Sanity executes those tool calls in a local Playwright-controlled browser.</li>
                  <li>The IDE agent reads page state, semantic summaries, assertions, screenshots, action history, and reports to decide what to do next.</li>
                </ol>
                <p style={styles.docsParagraph}>
                  This turns the IDE agent from a text-only assistant into a browser-based sanity-testing agent.
                </p>
              </div>
              <div style={styles.docsMiniGrid} className="docs-mini-grid">
                {capabilityAreas.map((item) => (
                  <article key={item} style={styles.docsMiniCard}>
                    <p style={styles.docsMiniCardText}>{item}</p>
                  </article>
                ))}
              </div>
            </DocSection>

            <DocSection id="architecture" eyebrow="Architecture" title="Codebase structure">
              <p style={styles.docsParagraph}>The codebase is organized into focused modules:</p>
              <div style={styles.docsStack}>
                {architectureModules.map(([name, description]) => (
                  <article key={name} style={styles.docsModuleCard}>
                    <div style={styles.docsModuleHeader}>
                      <code style={styles.docsInlineCode}>{name}</code>
                    </div>
                    <p style={styles.docsToolDescription}>{description}</p>
                  </article>
                ))}
              </div>
            </DocSection>

            <DocSection id="installation" eyebrow="Installation" title="Install and run Easy Sanity">
              <p style={styles.docsParagraph}>
                Easy Sanity supports three recommended setups: `uvx` for the fastest no-clone install, `pipx` for a
                permanent global install, and source checkout for development.
              </p>
              <div style={styles.docsStack}>
                <article style={styles.docsPane}>
                  <h3 style={styles.docsPaneTitle}>Recommended: `uvx`</h3>
                  <p style={styles.docsParagraph}>This is the simplest way to run Easy Sanity without cloning the repository.</p>
                  <CodeBlock label="1. Install the Playwright browser" code={uvxInstallBrowserCode} />
                  <CodeBlock label="2. Launch command" code={uvxLaunchCode} />
                </article>
                <article style={styles.docsPane}>
                  <h3 style={styles.docsPaneTitle}>Permanent install: `pipx`</h3>
                  <p style={styles.docsParagraph}>Use this if you want a globally available `easy-sanity` command.</p>
                  <CodeBlock label="Install package and browser" code={pipxInstallCode} />
                </article>
                <article style={styles.docsPane}>
                  <h3 style={styles.docsPaneTitle}>Development install from source</h3>
                  <p style={styles.docsParagraph}>Use this when you are working on the repo itself.</p>
                  <div style={styles.docsTwoUp} className="docs-two-up">
                    <CodeBlock label="Quick setup" code={sourceSetupCode} />
                    <CodeBlock label="Manual setup and run" code={sourceManualSetupCode} />
                  </div>
                  <div style={styles.docsCallout}>
                    <h3 style={styles.docsCalloutTitle}>What the setup script does</h3>
                    <ul style={styles.docsBulletList}>
                      <li>`uv sync`</li>
                      <li>`uv run easy-sanity install-browser`</li>
                    </ul>
                  </div>
                </article>
              </div>
            </DocSection>

            <DocSection id="configuration" eyebrow="Configuration" title="MCP client configuration">
              <p style={styles.docsParagraph}>
                The recommended MCP startup pattern is to pass runtime values through the server `env` block. `uvx`
                is the default launch command for Codex, while `pipx` and installed builds use `easy-sanity` directly.
              </p>
              <div style={styles.docsStack}>
                <CodeBlock label="Codex (`uvx`)" code={codexConfigCode} />
                <CodeBlock label="Installed build (`easy-sanity`)" code={pipxConfigCode} />
                <CodeBlock label="Claude Code / Cursor / Cline" code={claudeCursorClineConfigCode} />
              </div>
              <div style={styles.docsCallout}>
                <h3 style={styles.docsCalloutTitle}>After setup</h3>
                <ol style={styles.docsNumberList}>
                  <li>Restart the MCP client or IDE fully.</li>
                  <li>Confirm the server appears in MCP tools.</li>
                  <li>Run a smoke prompt such as `Use easy-sanity to open https://example.com and tell me the page title.`</li>
                </ol>
              </div>
              <div style={styles.docsTableWrap}>
                <table style={styles.docsTable}>
                  <thead>
                    <tr>
                      <th style={styles.docsTableHead}>Variable</th>
                      <th style={styles.docsTableHead}>Purpose</th>
                      <th style={styles.docsTableHead}>Default</th>
                    </tr>
                  </thead>
                  <tbody>
                    {envRows.map(([variable, purpose, defaultValue]) => (
                      <tr key={variable}>
                        <td style={styles.docsTableCell}>
                          <code style={styles.docsInlineCode}>{variable}</code>
                        </td>
                        <td style={styles.docsTableCell}>{purpose}</td>
                        <td style={styles.docsTableCell}>
                          <code style={styles.docsInlineCode}>{defaultValue}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={styles.docsCallout}>
                <h3 style={styles.docsCalloutTitle}>Runtime paths</h3>
                <ul style={styles.docsBulletList}>
                  <li>Installed builds default to a user-owned app data directory.</li>
                  <li>Source checkout runs keep using repo-local paths unless you override them with environment variables.</li>
                  <li>Use `EASY_SANITY_HOME` if you want to relocate the installed runtime home.</li>
                </ul>
              </div>
              <CodeBlock label="Inspect active runtime paths" code={pathsCode} />
            </DocSection>

            <DocSection id="data-artifacts" eyebrow="Data Model" title="Saved data and runtime artifacts">
              <div style={styles.docsTwoUp} className="docs-two-up">
                <article style={styles.docsPane}>
                  <h3 style={styles.docsPaneTitle}>Saved data</h3>
                  <ul style={styles.docsBulletList}>
                    <li>`data/tasks.json` for saved reusable tasks</li>
                    <li>`data/profiles.json` for reusable variable and environment profiles</li>
                    <li>`data/sample_tasks.json` for built-in onboarding and smoke-test samples</li>
                    <li>`data/app_memory/` for persistent repo-understanding memory for target applications</li>
                  </ul>
                </article>
                <article style={styles.docsPane}>
                  <h3 style={styles.docsPaneTitle}>Runtime artifacts</h3>
                  <ul style={styles.docsBulletList}>
                    <li>`artifacts/reports/` for markdown reports written at the end of browser sessions</li>
                    <li>`artifacts/screenshots/` for per-step screenshots grouped by session</li>
                    <li>`artifacts/downloads/` for downloaded files grouped by session</li>
                  </ul>
                </article>
              </div>
            </DocSection>

            <DocSection id="reporting-memory" eyebrow="Runtime Model" title="Reporting and app memory">
              <article style={styles.docsPane}>
                <h3 style={styles.docsPaneTitle}>Reporting model</h3>
                <ul style={styles.docsBulletList}>
                  <li>Step-by-step action history</li>
                  <li>Timestamps</li>
                  <li>Semantic route and page-change context</li>
                  <li>Screenshots</li>
                  <li>Final markdown report</li>
                </ul>
                <p style={styles.docsParagraph}>Reports are useful for QA evidence, debugging regressions, demo artifacts, and sharing what the agent saw and did.</p>
              </article>
              <article style={styles.docsPane}>
                <h3 style={styles.docsPaneTitle}>App memory model</h3>
                <ul style={styles.docsBulletList}>
                  <li>Scan a local code repository</li>
                  <li>Infer tech stack</li>
                  <li>Detect likely workflows</li>
                  <li>Detect route and entrypoint hints</li>
                  <li>Detect environment and test asset hints</li>
                  <li>Generate testing guidance</li>
                  <li>Persist manual notes and learned notes</li>
                  <li>Update over time across multiple sync runs</li>
                </ul>
                <p style={styles.docsParagraph}>This is stored per repo under `APP_MEMORY_DIR`.</p>
              </article>
            </DocSection>

            <DocSection id="tasks-profiles" eyebrow="Workflow Layer" title="Tasks and profiles">
              <p style={styles.docsParagraph}>
                The task system is designed to make long browser workflows reusable.
              </p>
              <div style={styles.docsMiniGrid} className="docs-mini-grid">
                {[
                  'Free-form prompt tasks',
                  'Structured tasks',
                  'Placeholders such as `{{base_url}}` or `{{password}}`',
                  'Secret variable detection',
                  'Reusable profiles such as `dev`, `staging`, or `prod`',
                  'Sample task import',
                  'Linting and task-authoring helpers',
                ].map((item) => (
                  <article key={item} style={styles.docsMiniCard}>
                    <p style={styles.docsMiniCardText}>{item}</p>
                  </article>
                ))}
              </div>
              <div style={styles.docsCallout}>
                <h3 style={styles.docsCalloutTitle}>Important current behavior</h3>
                <ul style={styles.docsBulletList}>
                  <li>Saved slash-command tasks store a prompt template.</li>
                  <li>Profiles and task rendering are supported.</li>
                  <li>Profile-backed direct slash-command execution may still require the IDE agent to render or bind profile values intentionally.</li>
                </ul>
              </div>
            </DocSection>

            <DocSection id="session-tools" eyebrow="Tool Reference" title="Browser session tools">
              <ToolList tools={sessionTools} />
            </DocSection>

            <DocSection id="inspection-tools" eyebrow="Tool Reference" title="Browser inspection tools">
              <ToolList tools={inspectionTools} columns={2} />
            </DocSection>

            <DocSection id="interaction-tools" eyebrow="Tool Reference" title="Browser navigation and interaction tools">
              <ToolList tools={interactionTools} columns={2} />
            </DocSection>

            <DocSection id="wait-tools" eyebrow="Tool Reference" title="Synchronization and wait tools">
              <ToolList tools={waitTools} />
            </DocSection>

            <DocSection id="extraction-tools" eyebrow="Tool Reference" title="Extraction tools">
              <ToolList tools={extractionTools} />
            </DocSection>

            <DocSection id="assertion-tools" eyebrow="Tool Reference" title="Assertion tools">
              <p style={styles.docsParagraph}>
                These tools shift Easy Sanity from browser automation into explicit testing.
              </p>
              <ToolList tools={assertionTools} columns={2} />
            </DocSection>

            <DocSection id="task-tools" eyebrow="Tool Reference" title="Task tools">
              <ToolList tools={taskTools} />
            </DocSection>

            <DocSection id="profile-tools" eyebrow="Tool Reference" title="Profile tools">
              <ToolList tools={profileTools} />
            </DocSection>

            <DocSection id="memory-tools" eyebrow="Tool Reference" title="App memory tools">
              <ToolList tools={memoryTools} />
            </DocSection>

            <DocSection id="examples" eyebrow="Examples" title="Usage patterns">
              <div style={styles.docsStack}>
                <article style={styles.docsPane}>
                  <h3 style={styles.docsPaneTitle}>Example 1: Simple browser inspection</h3>
                  <CodeBlock label="Prompt" code="Use easy-sanity to open https://example.com and tell me the page title." />
                  <ul style={styles.docsBulletList}>
                    <li>`browser_start`</li>
                    <li>`browser_navigate`</li>
                    <li>`browser_get_state`</li>
                    <li>`browser_stop`</li>
                  </ul>
                </article>
                <article style={styles.docsPane}>
                  <h3 style={styles.docsPaneTitle}>Example 2: Login sanity check</h3>
                  <CodeBlock label="Prompt" code="Use easy-sanity to log into the app, verify the dashboard opens, and stop with a pass/fail summary." />
                  <ul style={styles.docsBulletList}>
                    <li>`browser_start`</li>
                    <li>`browser_navigate`</li>
                    <li>`browser_fill`</li>
                    <li>`browser_click_by_role`</li>
                    <li>`browser_wait_for_network_idle`</li>
                    <li>`assert_url_contains`</li>
                    <li>`assert_text_visible`</li>
                    <li>`browser_stop`</li>
                  </ul>
                </article>
                <article style={styles.docsPane}>
                  <h3 style={styles.docsPaneTitle}>Example 3: Reusable profile-backed task</h3>
                  <CodeBlock label="Prompt" code="Create a saved browser workflow with placeholders for URL, email, and password." />
                  <ol style={styles.docsNumberList}>
                    <li>Save the task with `task_create`</li>
                    <li>Save credentials with `profile_save`</li>
                    <li>Render or execute with `task_render`</li>
                  </ol>
                </article>
                <article style={styles.docsPane}>
                  <h3 style={styles.docsPaneTitle}>Example 4: Repo-aware sanity testing</h3>
                  <CodeBlock label="Prompt" code="Use easy-sanity to sync the target app repo into memory and generate a testing brief for the login workflow." />
                  <ul style={styles.docsBulletList}>
                    <li>`app_memory_sync`</li>
                    <li>`app_memory_testing_brief`</li>
                  </ul>
                </article>
              </div>
            </DocSection>

            <DocSection id="best-practices" eyebrow="Guidance" title="Recommended usage guidance">
              <ul style={styles.docsBulletList}>
                <li>Prefer semantic tools before raw selector tools.</li>
                <li>Prefer wait tools over fixed sleeps.</li>
                <li>Use assertions for explicit pass/fail checks.</li>
                <li>Use `browser_get_dom_summary` when a page layout is complex.</li>
                <li>Use tasks and profiles for repeated flows.</li>
                <li>Use app memory when the agent also has access to the application repository.</li>
                <li>Try the launch command directly in a terminal first if an MCP client is not showing tools.</li>
              </ul>
            </DocSection>

            <DocSection id="security" eyebrow="Operations" title="Security and secret handling">
              <ul style={styles.docsBulletList}>
                <li>Store passwords and secrets in profiles or external environment variables.</li>
                <li>Avoid saving credentials directly inside reusable tasks.</li>
                <li>
                  Use placeholders such as <code style={styles.docsInlineCode}>{'{{password}}'}</code> in tasks.
                </li>
                <li>Use `mask_secrets=true` when retrieving or rendering sensitive profiles.</li>
              </ul>
              <div style={styles.docsCallout}>
                <h3 style={styles.docsCalloutTitle}>Important nuance</h3>
                <ul style={styles.docsBulletList}>
                  <li>The secret exists in the runtime values if the agent needs to log in.</li>
                  <li>Masking helps reduce accidental display and persistence in tool output.</li>
                  <li>It does not replace real secret-management practices.</li>
                </ul>
              </div>
            </DocSection>

            <DocSection id="strengths-limitations" eyebrow="Operational Fit" title="Strengths and limitations">
              <div style={styles.docsTwoUp} className="docs-two-up">
                <article style={styles.docsPane}>
                  <h3 style={styles.docsPaneTitle}>Current strengths</h3>
                  <ul style={styles.docsBulletList}>
                    <li>Internal smoke tests</li>
                    <li>Browser-based sanity checks</li>
                    <li>Navigating real product flows</li>
                    <li>Collecting step evidence</li>
                    <li>Reusable LLM-driven workflows</li>
                    <li>Repo-informed exploratory sanity testing</li>
                  </ul>
                </article>
                <article style={styles.docsPane}>
                  <h3 style={styles.docsPaneTitle}>Current limitations</h3>
                  <ul style={styles.docsBulletList}>
                    <li>Profile-aware direct slash-command execution still requires intentional agent behavior.</li>
                    <li>Some highly dynamic or custom component libraries may still require fallback selectors.</li>
                    <li>Browser automation quality still depends partly on the reasoning quality of the IDE agent.</li>
                    <li>Local runtime environment must have Playwright Chromium installed.</li>
                    <li>Some advanced reporting-tool APIs proposed in the roadmap are not yet implemented.</li>
                  </ul>
                </article>
              </div>
            </DocSection>

            <DocSection id="related-docs" eyebrow="Support" title="Source run and troubleshooting">
              <div style={styles.docsStack}>
                <article style={styles.docsPane}>
                  <h3 style={styles.docsPaneTitle}>Run from a source checkout</h3>
                  <CodeBlock label="Repo launch" code={sourceRunCode} />
                </article>
                <article style={styles.docsPane}>
                  <h3 style={styles.docsPaneTitle}>Troubleshooting</h3>
                  <ul style={styles.docsBulletList}>
                    <li>If `easy-sanity: command not found`, confirm `pipx` is on your shell path.</li>
                    <li>If you used `uvx`, launch the server through `uvx easy-sanity` instead of `easy-sanity`.</li>
                    <li>If browser launch fails, install Chromium first.</li>
                    <li>If the MCP client starts but no tools appear, restart the IDE and re-check `command`, `args`, and `env`.</li>
                  </ul>
                  <CodeBlock label="Install Chromium when browser launch fails" code={troubleshootBrowserCode} />
                </article>
              </div>
            </DocSection>

            <DocSection id="summary" eyebrow="Summary" title="What Easy Sanity brings together">
              <p style={styles.docsParagraph}>
                Easy Sanity is a local MCP browser-testing agent that combines:
              </p>
              <ul style={styles.docsBulletList}>
                <li>Browser control</li>
                <li>Semantic page understanding</li>
                <li>Explicit assertions</li>
                <li>Evidence capture</li>
                <li>Reusable tasks</li>
                <li>Environment profiles</li>
                <li>Persistent app memory</li>
              </ul>
              <p style={styles.docsParagraph}>
                Together, those pieces make it much more than a raw browser driver. It is designed to be an autonomous,
                reusable, test-oriented browser agent for real application sanity testing.
              </p>
            </DocSection>
          </div>
        </div>
      </main>
    </div>
  )
}
