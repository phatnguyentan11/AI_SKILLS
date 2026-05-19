const DOC_NAV_STATE_KEY = "project-ai-docs-left-collapsed";

let tocObserver;
let revealObserver;

const ARCHITECTURE_DIAGRAM = `
  <div class="architecture-diagram poster-diagram">
    <div class="arch-layer arch-layer--workspace">
      <div class="arch-title">
        <span class="arch-icon">01</span>
        <div>
          <b>Developer Workspace</b>
          <small>Task cần làm · File đang mở · Docs nội bộ · Ràng buộc bảo mật</small>
        </div>
      </div>
      <div class="arch-cells">
        <span>Task brief</span>
        <span>#file context</span>
        <span>Docs nội bộ</span>
        <span>Ràng buộc bảo mật</span>
      </div>
    </div>
    <div class="arch-arrow">↓</div>
    <div class="arch-layer arch-layer--runtime">
      <div class="arch-title">
        <span class="arch-icon">02</span>
        <div>
          <b>Copilot Chat / AI Runtime</b>
          <small>Đọc context · Hiểu intent · Chọn prompt · Trả lời có evidence</small>
        </div>
      </div>
      <div class="arch-cells">
        <span>Ask mode</span>
        <span>Agent mode</span>
        <span>Plan mode</span>
        <span>Intent parsing</span>
      </div>
    </div>
    <div class="arch-arrow">↓</div>
    <div class="arch-layer arch-layer--policy">
      <div class="arch-title">
        <span class="arch-icon">03</span>
        <div>
          <b>Policy Layer · .github</b>
          <small>Banking gates, blocked-rules, path instructions — always active</small>
        </div>
      </div>
      <div class="arch-cells">
        <span>copilot-instructions</span>
        <span>blocked-rules</span>
        <span>path instructions</span>
        <span>banking gates</span>
      </div>
    </div>
    <div class="arch-arrow">↓</div>
    <div class="arch-layer arch-layer--agents">
      <div class="arch-title">
        <span class="arch-icon">04</span>
        <div>
          <b>AI Agent Orchestration</b>
          <small>Hub trung tâm — route intent sang agent chuyên biệt, collect evidence</small>
        </div>
      </div>
      <div class="arch-cells six">
        <span>@Planner</span>
        <span>@System Analyst</span>
        <span>@Code Reviewer</span>
        <span>@Security Reviewer</span>
        <span>@Tester</span>
        <span>@Docs Manager</span>
      </div>
    </div>
    <div class="arch-arrow">↓ delegates to ↓</div>
    <div class="arch-grid">
      <div class="arch-layer arch-layer--support">
        <div class="arch-title">
          <span class="arch-icon">05</span>
          <div>
            <b>Skill Layer</b>
            <small>Domain execution rules</small>
          </div>
        </div>
        <ul>
          <li>banking-grade</li>
          <li>system-analysis</li>
          <li>secure-code-review</li>
          <li>testing-verification</li>
        </ul>
      </div>
      <div class="arch-layer arch-layer--support">
        <div class="arch-title">
          <span class="arch-icon">06</span>
          <div>
            <b>Knowledge Base</b>
            <small>Playbook, catalog, memory</small>
          </div>
        </div>
        <ul>
          <li>workflow playbook</li>
          <li>agent catalog</li>
          <li>prompt catalog</li>
          <li>skills index</li>
        </ul>
      </div>
      <div class="arch-layer arch-layer--safety">
        <div class="arch-title">
          <span class="arch-icon">07</span>
          <div>
            <b>Safety Guardrails</b>
            <small>Không secret · Không PII</small>
          </div>
        </div>
        <ul>
          <li>Không secret / token</li>
          <li>Không PII / account</li>
          <li>Không production data</li>
          <li>Không log nhạy cảm</li>
        </ul>
      </div>
    </div>
    <div class="arch-arrow">↓ all converge to ↓</div>
    <div class="arch-layer arch-layer--evidence">
      <div class="arch-title">
        <span class="arch-icon">08</span>
        <div>
          <b>Evidence &amp; Docs Layer</b>
          <small>Plan · Verification · Line review · Changelog / delivery log</small>
        </div>
      </div>
      <div class="arch-cells">
        <span>Plan doc</span>
        <span>Verification</span>
        <span>Line review</span>
        <span>Changelog</span>
        <span>Delivery log</span>
        <span>Residual risk</span>
      </div>
    </div>
    <div class="arch-arrow">↓</div>
    <div class="arch-layer arch-layer--gov">
      <div class="arch-title">
        <span class="arch-icon">09</span>
        <div>
          <b>Local Governance</b>
          <small>setup.ps1 · pre-push hook · secret scan · policy scan</small>
        </div>
      </div>
      <div class="arch-cells">
        <span>setup.ps1</span>
        <span>pre-push hook</span>
        <span>secret scan</span>
        <span>policy scan</span>
      </div>
    </div>
  </div>`;

const PAGE_DATA = {
  "index.html": {
    title: "Hướng dẫn sử dụng Project AI",
    main: `
      <section class="doc-hero reveal" id="intro" data-section>
        <span class="eyebrow">Project AI · Copilot instructions · Agents · Skills · Local governance</span>
        <h1>Hướng dẫn sử dụng Project AI trong repository này.</h1>
        <p class="lead">Project AI là bộ <code>.github/</code> giúp Copilot làm việc theo quy trình: đọc context, phân tích hệ thống, lập plan, implement đúng scope, verify, review và cập nhật docs.</p>
      </section>
      <section class="section reveal" id="workflow" data-section>
        <h2>Luồng làm việc chuẩn</h2>
        <div class="flow-row">
          <div class="flow-step"><span class="num">1</span><span class="flow-step-kicker">Bắt đầu</span><h3>Đọc context</h3><p>Dùng <code>/scout</code> hoặc <code>/analyze-code</code> để tìm file, luồng và rule đang áp dụng.</p><small class="flow-step-note">Đầu ra mong đợi: hiểu đúng vùng cần sửa.</small></div>
          <div class="flow-step"><span class="num">2</span><span class="flow-step-kicker">Trước khi sửa</span><h3>Plan</h3><p>Dùng <code>/banking-plan</code> để chốt scope, risk, affected files và verification.</p><small class="flow-step-note">Đầu ra mong đợi: plan rõ ràng, chưa viết code.</small></div>
          <div class="flow-step"><span class="num">3</span><span class="flow-step-kicker">Thực thi</span><h3>Implement</h3><p>Dùng <code>/implement</code> sau khi plan được duyệt để sửa đúng file, đúng scope.</p><small class="flow-step-note">Đầu ra mong đợi: code thay đổi có kiểm soát.</small></div>
          <div class="flow-step"><span class="num">4</span><span class="flow-step-kicker">Xác nhận</span><h3>Verify</h3><p>Dùng <code>/test</code> hoặc chạy governance check để xác minh compile, behavior và policy.</p><small class="flow-step-note">Đầu ra mong đợi: pass/fail rõ ràng, có residual risk nếu còn.</small></div>
          <div class="flow-step"><span class="num">5</span><span class="flow-step-kicker">Chốt vòng</span><h3>Update docs</h3><p>Dùng <code>/docs-update</code> khi behavior, setup hoặc policy thay đổi để repo luôn đồng bộ.</p><small class="flow-step-note">Đầu ra mong đợi: changelog, delivery log và docs usage được cập nhật.</small></div>
        </div>
      </section>
      <section class="section reveal" id="components" data-section>
        <h2>Thành phần Project AI</h2>
        <div class="comp-grid">
          <div class="comp-card comp-card--instructions">
            <div class="comp-card-header">
              <span class="arch-icon">IN</span>
              <div><b>Instructions</b><small>Luật nền và luật theo file</small></div>
            </div>
            <p class="comp-desc">Always-on banking gates và luật theo path — nạp tự động khi <code>applyTo</code> khớp file trong context.</p>
            <div class="comp-files">
              <code>copilot-instructions.md</code>
              <code>aspnet-core.instructions.md</code>
              <code>banking-grade.instructions.md</code>
            </div>
          </div>
          <div class="comp-card comp-card--prompts">
            <div class="comp-card-header">
              <span class="arch-icon">PM</span>
              <div><b>Prompts</b><small>Workflow thao tác nhanh</small></div>
            </div>
            <p class="comp-desc">Slash commands định nghĩa quy trình rõ ràng — plan, implement, review, docs.</p>
            <div class="comp-pills">
              <span class="pill">/banking-plan</span>
              <span class="pill">/implement</span>
              <span class="pill">/test</span>
              <span class="pill">/docs-update</span>
            </div>
          </div>
          <div class="comp-card comp-card--agents">
            <div class="comp-card-header">
              <span class="arch-icon">AG</span>
              <div><b>Agents</b><small>Vai trò chuyên biệt</small></div>
            </div>
            <p class="comp-desc">Mỗi agent có profile, tool restrictions và behavior rule riêng — gọi bằng <code>@AgentName</code>.</p>
            <div class="comp-pills">
              <span class="pill">@Planner</span>
              <span class="pill">@System Analyst</span>
              <span class="pill">@Tester</span>
              <span class="pill">@Docs Manager</span>
            </div>
          </div>
          <div class="comp-card comp-card--skills">
            <div class="comp-card-header">
              <span class="arch-icon">SK</span>
              <div><b>Skills</b><small>Năng lực domain</small></div>
            </div>
            <p class="comp-desc">Domain rules nạp khi agent cần — banking, testing, database, security review.</p>
            <div class="comp-pills">
              <span class="pill">banking-grade</span>
              <span class="pill">secure-code-review</span>
              <span class="pill">dotnet-testing</span>
              <span class="pill">database-data-integrity</span>
            </div>
          </div>
          <div class="comp-card comp-card--rules">
            <div class="comp-card-header">
              <span class="arch-icon">BR</span>
              <div><b>Blocked Rules</b><small>Policy kernel trung tâm</small></div>
            </div>
            <p class="comp-desc">Nguồn rule cấm duy nhất — luôn active, không thể override, áp dụng mọi request.</p>
            <div class="comp-files"><code>blocked-rules.md</code></div>
          </div>
          <div class="comp-card comp-card--gov">
            <div class="comp-card-header">
              <span class="arch-icon">LG</span>
              <div><b>Local Governance</b><small>Setup + pre-push check</small></div>
            </div>
            <p class="comp-desc">Script kiểm tra package, frontmatter, secret scan và policy scan trước khi push.</p>
            <div class="comp-files">
              <code>setup.ps1</code>
              <code>pre-push-governance-check.ps1</code>
            </div>
          </div>
        </div>
      </section>
      <section class="section reveal" id="safety" data-section>
        <h2>Rule an toàn phải nhớ</h2>
        <p class="section-intro">Đọc block này theo thứ tự trái sang phải: được phép đưa gì vào, tuyệt đối không đưa gì vào, và output tối thiểu AI phải trả về.</p>
        <div class="safety-board">
          <div class="safety-card allow">
            <div class="safety-head">
              <span class="safety-icon">✓</span>
              <div>
                <h3>Allowed input</h3>
                <p>Chỉ đưa đúng phần cần để AI hiểu task.</p>
              </div>
            </div>
            <ul class="safety-list">
              <li>Task, goal, constraint và expected output</li>
              <li>Code, docs, config và metadata đã được phép chia sẻ nội bộ</li>
              <li>File context tối thiểu bằng <code>#file:</code> hoặc vùng code đang sửa</li>
            </ul>
          </div>
          <div class="safety-card block">
            <div class="safety-head">
              <span class="safety-icon">!</span>
              <div>
                <h3>Never send to AI</h3>
                <p>Đây là vùng cấm, không cần cân nhắc thêm.</p>
              </div>
            </div>
            <ul class="safety-list">
              <li>Secret, token, password, key, certificate</li>
              <li>PII, dữ liệu tài khoản, dữ liệu thẻ, dữ liệu production</li>
              <li>Log nhạy cảm, credential tạm, thông tin truy cập thật</li>
            </ul>
          </div>
          <div class="safety-card require">
            <div class="safety-head">
              <span class="safety-icon">→</span>
              <div>
                <h3>Required AI output</h3>
                <p>Không chỉ trả lời, mà phải để người review kiểm chứng được.</p>
              </div>
            </div>
            <ul class="safety-list">
              <li>Plan hoặc reasoning đủ để hiểu AI đang làm gì</li>
              <li>Verification, review finding hoặc residual risk</li>
              <li>Docs update note khi behavior hoặc policy thay đổi</li>
            </ul>
          </div>
        </div>
        <div class="usage-tip"><span class="usage-tip-icon">🔒</span><span>Nếu một request cần dữ liệu thật để trả lời, hãy dừng ở đó và thay bằng dữ liệu mô phỏng hoặc mô tả đã làm sạch.</span></div>
      </section>`,
    toc: [
      ["#intro", "Giới thiệu"],
      ["#workflow", "Luồng chính"],
      ["#components", "Thành phần"],
      ["#safety", "An toàn"],
    ],
  },
  "overview.html": {
    title: "Tổng quan hệ thống Project AI",
    main: `
      <section class="doc-hero reveal" id="intro" data-section>
        <span class="eyebrow">Tổng quan hệ thống</span>
        <h1>Project AI là lớp điều phối Copilot trong repository này.</h1>
        <p class="lead">Trang này mô tả cấu trúc lớn: mục tiêu từ người dùng, lớp prompt, runtime của agent, policy kernel, lớp bằng chứng và local governance.</p>
      </section>
      <section class="section reveal" id="system" data-section>
        <h2>Kiến trúc theo lớp</h2>
        <p class="section-intro">Đây là bản đồ hệ thống dạng tầng. Mỗi layer có trách nhiệm riêng, giúp AI không trả lời tự do mà đi theo luật, vai trò, skill và bằng chứng kiểm chứng được.</p>
        ${ARCHITECTURE_DIAGRAM}
      </section>
      <section class="section reveal" id="map" data-section>
        <h2>AI system map</h2>
        <div class="diagram system-map">
          <div class="node">Developer Intent<small>task, câu hỏi, mục tiêu</small></div>
          <div class="stack"><div class="node primary">Prompt + Agent Layer</div><div class="node">Prompt · Agent · Skill · Policy</div></div>
          <div class="node">Evidence<small>plan, checks, docs</small></div>
        </div>
      </section>
      <section class="section reveal" id="layers" data-section>
        <h2>Các lớp chính</h2>
        <div class="swimlane">
          <div class="lane-title">Luật</div><div class="lane"><span class="pill">instructions</span><span class="pill">blocked-rules</span></div>
          <div class="lane-title">Vai trò</div><div class="lane"><span class="pill">planner</span><span class="pill">analyst</span><span class="pill">reviewer</span></div>
          <div class="lane-title">Bằng chứng</div><div class="lane"><span class="pill">verification</span><span class="pill">delivery log</span><span class="pill">changelog</span></div>
        </div>
      </section>
      <section class="section reveal" id="boundary" data-section>
        <h2>Phạm vi local-only</h2>
        <p>Giai đoạn này chỉ dùng local setup và local governance hook. Không thêm PR template, CODEOWNERS, branch protection, GitHub Actions hoặc CI/CD.</p>
      </section>`,
    toc: [
      ["#intro", "Giới thiệu"],
      ["#system", "Kiến trúc"],
      ["#map", "Bản đồ AI"],
      ["#layers", "Các lớp"],
      ["#boundary", "Phạm vi"],
    ],
  },
  "usage.html": {
    title: "Cách dùng Project AI hằng ngày",
    main: `
      <section class="doc-hero reveal" id="start" data-section>
        <span class="eyebrow">User actions · Agents · Prompts · Git</span>
        <h1>User gõ gì — AI làm gì — kết quả là gì.</h1>
        <p class="lead">Hướng dẫn này tập trung hoàn toàn vào thao tác của người dùng: gõ gì vào chat, nhận lại gì, phản hồi thế nào, cho đến khi commit và push.</p>
      </section>

      <section class="section reveal" id="plain-chat" data-section>
        <div class="usage-section-label">Chat thường · Ask mode · Không dùng agent</div>
        <h2>Khi không gõ @agent hay /prompt — AI làm gì?</h2>
        <p class="section-intro">Copilot có 3 mode chọn ở bottom chat. Dù dùng mode nào, <b>instructions vẫn luôn được nạp tự động</b>.</p>

        <div class="mode-grid">
          <div class="mode-card mode-card--ask">
            <div class="mode-card-header">
              <span class="arch-icon">ASK</span>
              <div><b>Ask mode <span class="mode-tag default-tag">mặc định</span></b><small>Q&amp;A · không tự sửa file</small></div>
            </div>
            <p>Trả lời câu hỏi, giải thích code, suggest snippet. <b>Không tự sửa file.</b> User copy code thủ công hoặc dùng inline Accept.</p>
            <div class="mode-when">Dùng khi: hỏi về code, debug bằng tay, khám phá codebase.</div>
          </div>
          <div class="mode-card mode-card--agent">
            <div class="mode-card-header">
              <span class="arch-icon">AGT</span>
              <div><b>Agent mode</b><small>Tự edit file · iterate đến khi xong</small></div>
            </div>
            <p>Tự đọc file, edit code, chạy terminal command, iterate cho đến khi xong. <b>Tự động thay đổi file.</b> User review diff và Accept/Discard.</p>
            <div class="mode-when">Dùng khi: implement feature nhiều bước, fix bug phức tạp, tích hợp MCP tool.</div>
          </div>
          <div class="mode-card mode-card--plan">
            <div class="mode-card-header">
              <span class="arch-icon">PLN</span>
              <div><b>Plan mode</b><small>Research trước · code sau khi approve</small></div>
            </div>
            <div class="chat-mode-name">Plan</div>
            <p>Research + tạo plan, <b>không sửa code</b> cho đến khi user click &#8220;Start Implementation&#8221;. Plan agent chỉ dùng read-only tools.</p>
            <div class="mode-when">Dùng khi: muốn xem kế hoạch trước, review scope và risk trước khi cho AI implement.</div>
          </div>
        </div>

        <h3 class="section-h3">Instructions nào luôn active dù dùng mode nào</h3>
        <div class="plain-chat-always">
          <div class="always-row">
            <span class="always-icon always-on">✓ Always</span>
            <div><code>.github/copilot-instructions.md</code> — nạp cho <em>mọi</em> request. Banking gates, style governance, blocked-rules pointer đều áp dụng kể cả khi chat bình thường.</div>
          </div>
          <div class="always-row">
            <span class="always-icon always-on">✓ Auto</span>
            <div><code>*.instructions.md</code> theo path — tự nạp nếu file trong context khớp <code>applyTo</code> pattern. Ví dụ: mở <code>.cs</code> → <code>aspnet-core.instructions.md</code> tự áp dụng.</div>
          </div>
          <div class="always-row">
            <span class="always-icon always-on">✓ Always</span>
            <div><code>blocked-rules.md</code> — policy kernel luôn active. Yêu cầu vi phạm bị flag dù không dùng agent.</div>
          </div>
          <div class="always-row">
            <span class="always-icon optional-tag">~ Manual</span>
            <div><b>Agent profile + Skill</b> — chỉ nạp khi user gõ <code>@AgentName</code> hoặc Copilot auto-delegate. Không tự active khi chat thường.</div>
          </div>
        </div>

        <h3 class="section-h3">Ví dụ: chat không dùng agent</h3>
        <div class="chat-log">
          <div class="chat-row user">
            <div class="chat-avatar">U</div>
            <div class="chat-bubble">
              <code>#file:src/Controllers/PaymentController.cs</code><br>
              Giải thích đoạn validation ở dòng 45-67. Tại sao lại check null trước khi map?
              <span class="chat-effect">→ Ask mode: không cần @agent. AI đọc file + instructions, trả lời bằng văn bản.</span>
            </div>
          </div>
          <div class="chat-row ai">
            <div class="chat-avatar">AI</div>
            <div class="chat-bubble">
              AI đọc <code>copilot-instructions.md</code> + <code>aspnet-core.instructions.md</code> tự động, giải thích đoạn code được đính kèm.<br>
              <b>Không tự sửa file</b> — chỉ explanation và suggestion. User tự quyết định apply hay không.
            </div>
          </div>
          <div class="chat-row user">
            <div class="chat-avatar">U</div>
            <div class="chat-bubble">
              <i>[Chọn function trong editor]</i> Ctrl+I → "Refactor to use the existing validation helper class"
              <span class="chat-effect">→ Inline chat (Agent mode): AI đề xuất diff ngay trong editor. User click Accept hoặc Discard.</span>
            </div>
          </div>
          <div class="chat-row ai">
            <div class="chat-avatar">AI</div>
            <div class="chat-bubble">
              Tạo diff inline. Instructions vẫn active: AI tìm helper có sẵn theo <b>component-first</b> rule trong <code>copilot-instructions.md</code> — không tạo class mới nếu đã có.<br>
              User click <b>Accept</b> để apply hoặc <b>Discard</b>.
            </div>
          </div>
        </div>
        <div class="usage-tip"><span class="usage-tip-icon">💡</span><span>Dùng <b>Ask mode</b> khi cần hiểu trước khi làm. Chuyển sang <b>Agent mode</b> hoặc gọi <code>@agent</code> khi đã biết rõ muốn làm gì.</span></div>
      </section>

      <section class="section reveal" id="planner-flow" data-section>
        <div class="usage-section-label">Ví dụ đầy đủ · @Planner</div>
        <h2>Luồng @Planner từ A đến Z</h2>
        <p class="section-intro">Ví dụ: user cần thêm rate-limiting vào payment API. Đây là từng tin nhắn user gõ và tác động tương ứng.</p>

        <h3 class="section-h3">Bước 1 — Cung cấp context</h3>
        <p>Trước khi gọi agent, user đính kèm file liên quan để AI có đủ thông tin:</p>
        <div class="chat-log">
          <div class="chat-row user">
            <div class="chat-avatar">U</div>
            <div class="chat-bubble">
              <code>#file:src/Controllers/PaymentController.cs</code><br>
              <code>#file:src/Services/PaymentService.cs</code><br>
              <span class="chat-effect">→ VS Code đính kèm nội dung 2 file vào context của request</span>
            </div>
          </div>
        </div>

        <h3 class="section-h3">Bước 2 — Gọi Planner với intent rõ ràng</h3>
        <div class="chat-log">
          <div class="chat-row user">
            <div class="chat-avatar">U</div>
            <div class="chat-bubble">
              <b>@Planner</b> Tôi cần thêm rate-limiting cho endpoint <code>POST /api/payments</code>. Không dùng thư viện chưa có trong codebase.
              <span class="chat-effect">→ Planner agent được kích hoạt, nhận file context + instruction</span>
            </div>
          </div>
          <div class="chat-row ai">
            <div class="chat-avatar">AI</div>
            <div class="chat-bubble">
              Đang phân tích <code>PaymentController.cs</code>, <code>PaymentService.cs</code> và tìm các component liên quan trong codebase...<br><br>
              <b>Plan:</b> Goal · Scope · Non-goals · Affected files · Phases · Risks · Rollback · Verification commands
              <span class="chat-effect">→ AI trả plan cấu trúc đầy đủ, KHÔNG viết code</span>
            </div>
          </div>
        </div>

        <h3 class="section-h3">Bước 3 — User đọc plan và yêu cầu chỉnh sửa</h3>
        <div class="chat-log">
          <div class="chat-row user">
            <div class="chat-avatar">U</div>
            <div class="chat-bubble">
              Plan thiếu xử lý concurrent request — nếu nhiều request tới cùng lúc thì rate-limit có race condition không? Hãy bổ sung phân tích và rollback cho trường hợp này.
              <span class="chat-effect">→ Planner revise plan, bổ sung mục concurrency risk + rollback note</span>
            </div>
          </div>
          <div class="chat-row ai">
            <div class="chat-avatar">AI</div>
            <div class="chat-bubble">
              Đã cập nhật: bổ sung phân tích race condition trong phần Risks, thêm rollback note dùng <code>IDistributedCache</code> làm fallback nếu in-memory counter bị lệch.<br>
              <b>Plan revised — awaiting approval.</b>
            </div>
          </div>
        </div>

        <h3 class="section-h3">Bước 4 — Approve plan và chuyển sang implement</h3>
        <div class="chat-log">
          <div class="chat-row user">
            <div class="chat-avatar">U</div>
            <div class="chat-bubble">
              Plan approved. Proceed with phase 1: tạo middleware class.
              <span class="chat-effect">→ AI bắt đầu viết code theo đúng plan, đúng scope, theo codebase pattern</span>
            </div>
          </div>
          <div class="chat-row ai">
            <div class="chat-avatar">AI</div>
            <div class="chat-bubble">
              <b>Phase 1 done.</b> Đã tạo <code>RateLimitingMiddleware.cs</code> dùng <code>IMemoryCache</code> đã có trong codebase.<br>
              Files changed: 1 · Compile: ✓ · Residual risk: distributed scenario chưa test
            </div>
          </div>
        </div>

        <h3 class="section-h3">Bước 5 — Chạy test và code review</h3>
        <div class="chat-log">
          <div class="chat-row user">
            <div class="chat-avatar">U</div>
            <div class="chat-bubble">
              <b>@Tester</b> Hãy tìm test commands cho middleware layer và chạy.
              <span class="chat-effect">→ Tester tìm lệnh test hẹp nhất, báo pass/fail/root cause</span>
            </div>
          </div>
          <div class="chat-row user">
            <div class="chat-avatar">U</div>
            <div class="chat-bubble">
              <b>@Code Reviewer</b> <code>#file:src/Middleware/RateLimitingMiddleware.cs</code> Review trước khi commit.
              <span class="chat-effect">→ Reviewer kiểm tra correctness, security, concurrency, test gap</span>
            </div>
          </div>
          <div class="chat-row ai">
            <div class="chat-avatar">AI</div>
            <div class="chat-bubble">
              <b>Finding HIGH:</b> thiếu validation khi <code>clientId</code> null — có thể bypass rate limit.<br>
              <b>Finding LOW:</b> magic number <code>100</code> nên extract ra config.<br>
              No critical findings. Residual risk: distributed cache failover chưa test.
            </div>
          </div>
          <div class="chat-row user">
            <div class="chat-avatar">U</div>
            <div class="chat-bubble">
              Fix finding HIGH — thêm null check cho clientId.
              <span class="chat-effect">→ AI fix đúng finding, không refactor ngoài scope</span>
            </div>
          </div>
        </div>

        <h3 class="section-h3">Bước 6 — Commit và push</h3>
        <div class="chat-log">
          <div class="chat-row user">
            <div class="chat-avatar">U</div>
            <div class="chat-bubble">
              Chạy governance check trước khi commit.
              <span class="chat-effect">→ User chạy script, xem kết quả warning/error trước khi stage</span>
            </div>
          </div>
        </div>
        <div class="code-card"><pre><code>.github\\scripts\\pre-push-governance-check.ps1 -Mode Warn
git diff --stat
git add src/Middleware/RateLimitingMiddleware.cs
git add src/Program.cs
git commit -m "feat(payment): add rate-limiting middleware for POST /api/payments"
git push</code></pre></div>
        <div class="usage-tip"><span class="usage-tip-icon">🔒</span><span>Không dùng <code>--no-verify</code> hoặc <code>--force</code> khi push mà không có approval rõ ràng.</span></div>
      </section>

      <section class="section reveal" id="all-agents" data-section>
        <div class="usage-section-label">Tất cả agents · Khi nào dùng gì</div>
        <h2>Flow của từng agent</h2>
        <p class="section-intro">Mỗi agent có vai trò riêng. Click vào tên agent để xem chi tiết cách gọi và khi nào dùng.</p>
        <div class="agent-grid">

          <div class="agent-card">
            <button class="agent-toggle" type="button" aria-expanded="false">
              <div class="agent-card-header">
                <div class="agent-icon agent-icon--planner">P</div>
                <div><h3>@Planner</h3><small>Plan before implement</small></div>
              </div>
              <span class="toggle-icon">+</span>
            </button>
            <div class="agent-card-body" hidden>
              <p class="agent-desc">Agent chuyên lập kế hoạch — không viết code. Phân tích affected files, risks, rollback và phases. User phải approve trước khi AI implement bất kỳ thứ gì.</p>
              <ul>
                <li>User gõ <code>@Planner</code> + mô tả task + đính kèm file</li>
                <li>AI trả plan cấu trúc: goal, scope, phases, risks, rollback</li>
                <li>User review plan → request update → approve</li>
                <li>User gõ <em>"Plan approved. Proceed."</em> để chuyển sang implement</li>
              </ul>
              <div class="agent-trigger"><b>Dùng khi:</b> thêm feature, sửa business logic, migration, thay đổi có risk</div>
            </div>
          </div>

          <div class="agent-card">
            <button class="agent-toggle" type="button" aria-expanded="false">
              <div class="agent-card-header">
                <div class="agent-icon agent-icon--analyst">SA</div>
                <div><h3>@System Analyst</h3><small>Hiểu hệ thống trước khi làm</small></div>
              </div>
              <span class="toggle-icon">+</span>
            </button>
            <div class="agent-card-body" hidden>
              <p class="agent-desc">Agent phân tích kiến trúc. Map entry points, data flow, blast radius và business rules. Output được dùng trực tiếp làm input cho Planner.</p>
              <ul>
                <li>User gõ <code>@System Analyst</code> + mô tả vùng cần hiểu + file đính kèm</li>
                <li>AI map architecture, entry points, data flow, blast radius</li>
                <li>User nhận bản phân tích: file nào liên quan, luồng nào bị ảnh hưởng</li>
                <li>Dùng output làm input cho Planner</li>
              </ul>
              <div class="agent-trigger"><b>Dùng khi:</b> cần hiểu module lạ, trace bug, chuẩn bị refactor lớn</div>
            </div>
          </div>

          <div class="agent-card">
            <button class="agent-toggle" type="button" aria-expanded="false">
              <div class="agent-card-header">
                <div class="agent-icon agent-icon--reviewer">CR</div>
                <div><h3>@Code Reviewer</h3><small>Review code trước khi commit</small></div>
              </div>
              <span class="toggle-icon">+</span>
            </button>
            <div class="agent-card-body" hidden>
              <p class="agent-desc">Agent review từng dòng thay đổi. Trả findings theo severity Critical → High → Medium → Low. Kiểm tra correctness, security, business logic và test coverage gap.</p>
              <ul>
                <li>User đính kèm file/diff + gõ <code>@Code Reviewer</code></li>
                <li>AI review mỗi dòng, trả findings theo severity: Critical → High → Medium → Low</li>
                <li>User fix Critical/High, ghi nhận Medium, chấp nhận Low có lý do</li>
                <li>User yêu cầu verify: <em>"Xác nhận finding #2 đã resolved."</em></li>
              </ul>
              <div class="agent-trigger"><b>Dùng khi:</b> sau implement, trước commit, review PR của người khác</div>
            </div>
          </div>

          <div class="agent-card">
            <button class="agent-toggle" type="button" aria-expanded="false">
              <div class="agent-card-header">
                <div class="agent-icon agent-icon--security">SR</div>
                <div><h3>@Security Reviewer</h3><small>Security audit chuyên sâu</small></div>
              </div>
              <span class="toggle-icon">+</span>
            </button>
            <div class="agent-card-body" hidden>
              <p class="agent-desc">Agent audit bảo mật theo OWASP Top 10. Kiểm tra auth/authz, PII, secrets, cryptography và idempotency. Dùng kết hợp với Code Reviewer — không thay thế.</p>
              <ul>
                <li>User đính kèm file security-sensitive + gõ <code>@Security Reviewer</code></li>
                <li>AI kiểm tra: auth/authz, input validation, secrets, PII, logging, cryptography</li>
                <li>User nhận severity-ranked findings với file/symbol reference cụ thể</li>
                <li>User fix required findings, ghi nhận residual risk</li>
              </ul>
              <div class="agent-trigger"><b>Dùng khi:</b> auth, token, encryption, permission, external API, payment flow</div>
            </div>
          </div>

          <div class="agent-card">
            <button class="agent-toggle" type="button" aria-expanded="false">
              <div class="agent-card-header">
                <div class="agent-icon agent-icon--tester">T</div>
                <div><h3>@Tester</h3><small>Tìm và chạy verification</small></div>
              </div>
              <span class="toggle-icon">+</span>
            </button>
            <div class="agent-card-body" hidden>
              <p class="agent-desc">Agent tìm và chạy test hẹp nhất. Không weaken assertion, không fake data. Khi fail — phân tích root cause và gợi ý fix cụ thể.</p>
              <ul>
                <li>User gõ <code>@Tester</code> + mô tả vùng cần test</li>
                <li>AI tìm lệnh test hẹp nhất, recommend command, chạy và báo pass/fail</li>
                <li>Với fail: AI phân tích root cause, không fake data hay weaken assertion</li>
                <li>User nhận: commands ran, pass/fail list, failure analysis, residual risk</li>
              </ul>
              <div class="agent-trigger"><b>Dùng khi:</b> sau implement, trước push, khi CI fail cần debug</div>
            </div>
          </div>

          <div class="agent-card">
            <button class="agent-toggle" type="button" aria-expanded="false">
              <div class="agent-card-header">
                <div class="agent-icon agent-icon--docs">DM</div>
                <div><h3>@Docs Manager</h3><small>Cập nhật tài liệu sau thay đổi</small></div>
              </div>
              <span class="toggle-icon">+</span>
            </button>
            <div class="agent-card-body" hidden>
              <p class="agent-desc">Agent cập nhật docs sau mỗi thay đổi. Ghi vào project-docs-base.md, project-changelog.md, feature-delivery-log.md. Chỉ ghi những gì thực sự đã thay đổi — không bịa.</p>
              <ul>
                <li>User gõ <code>@Docs Manager</code> + mô tả thay đổi vừa implement</li>
                <li>AI đọc docs hiện tại, cập nhật đúng phần liên quan: behavior, setup, API, changelog</li>
                <li>AI cập nhật <code>project-docs-base.md</code>, <code>project-changelog.md</code>, <code>feature-delivery-log.md</code></li>
                <li>User nhận: docs đã thay đổi, lý do, gap còn lại</li>
              </ul>
              <div class="agent-trigger"><b>Dùng khi:</b> sau feature/fix/migration, khi behavior hoặc setup thay đổi</div>
            </div>
          </div>

          <div class="agent-card">
            <button class="agent-toggle" type="button" aria-expanded="false">
              <div class="agent-card-header">
                <div class="agent-icon agent-icon--researcher">R</div>
                <div><h3>@Researcher</h3><small>Tìm context nhanh trong repo</small></div>
              </div>
              <span class="toggle-icon">+</span>
            </button>
            <div class="agent-card-body" hidden>
              <p class="agent-desc">Agent tìm context trong codebase. Tổng hợp file liên quan, pattern đang dùng và approved components. Output dùng làm input cho Planner hoặc System Analyst.</p>
              <ul>
                <li>User gõ <code>@Researcher</code> + câu hỏi về codebase</li>
                <li>AI tìm kiếm docs, source, tests, config liên quan và tổng hợp</li>
                <li>User nhận: file list, đoạn code liên quan, pattern đang dùng</li>
                <li>Dùng output để chuẩn bị context trước khi gọi Planner hay Analyst</li>
              </ul>
              <div class="agent-trigger"><b>Dùng khi:</b> cần tìm nhanh pattern, convention, existing component trong repo</div>
            </div>
          </div>

          <div class="agent-card">
            <button class="agent-toggle" type="button" aria-expanded="false">
              <div class="agent-card-header">
                <div class="agent-icon agent-icon--architect">RA</div>
                <div><h3>@Research Architect</h3><small>ADR, architecture tradeoffs</small></div>
              </div>
              <span class="toggle-icon">+</span>
            </button>
            <div class="agent-card-body" hidden>
              <p class="agent-desc">Agent nghiên cứu và so sánh lựa chọn kiến trúc hoặc công nghệ. Trả ADR-ready analysis với evidence, pros/cons và recommendation. Dùng trước khi quyết định library hoặc data model.</p>
              <ul>
                <li>User gõ <code>@Research Architect</code> + câu hỏi kiến trúc hoặc technology choice</li>
                <li>AI so sánh options, evidence-backed, trả recommendation với pros/cons</li>
                <li>User nhận: ADR-ready analysis, risk assessment, recommendation</li>
                <li>Dùng cho quyết định library, pattern, data model trước khi implement</li>
              </ul>
              <div class="agent-trigger"><b>Dùng khi:</b> chọn library, thiết kế schema, quyết định kiến trúc có impact lâu dài</div>
            </div>
          </div>

        </div>
      </section>

      <section class="section reveal" id="quick-lookup" data-section>
        <div class="usage-section-label">Tổng hợp · Bảng chọn nhanh</div>
        <h2>User gõ gì để làm gì</h2>
        <div class="quick-grid">
          <div class="quick-row"><span class="quick-label">Hiểu hệ thống</span><div class="quick-pills"><span class="pill">@System Analyst</span><span class="pill">@Researcher</span><span class="pill">/scout</span><span class="pill">#file:</span><span class="pill">#codebase</span></div></div>
          <div class="quick-row"><span class="quick-label">Plan</span><div class="quick-pills"><span class="pill">@Planner</span><span class="pill">/banking-plan</span></div></div>
          <div class="quick-row"><span class="quick-label">Implement</span><div class="quick-pills"><span class="pill">/implement</span><span class="pill">Plan approved. Proceed.</span></div></div>
          <div class="quick-row"><span class="quick-label">Review code</span><div class="quick-pills"><span class="pill">@Code Reviewer</span><span class="pill">@Security Reviewer</span><span class="pill">/line-review</span></div></div>
          <div class="quick-row"><span class="quick-label">Verify / Test</span><div class="quick-pills"><span class="pill">@Tester</span><span class="pill">/test</span><span class="pill">pre-push-governance-check.ps1</span></div></div>
          <div class="quick-row"><span class="quick-label">Docs</span><div class="quick-pills"><span class="pill">@Docs Manager</span><span class="pill">/docs-update</span></div></div>
          <div class="quick-row"><span class="quick-label">Architecture</span><div class="quick-pills"><span class="pill">@Research Architect</span><span class="pill">/analyze-code</span></div></div>
        </div>
      </section>`,
    toc: [
      ["#start", "Giới thiệu"],
      ["#plain-chat", "AI không có agent"],
      ["#planner-flow", "@Planner A→Z"],
      ["#all-agents", "Tất cả agents"],
      ["#quick-lookup", "Bảng chọn nhanh"],
    ],
  },
  "tutorial-agent-flow.html": {
    title: "Tutorial luồng Agent",
    main: `
      <section class="doc-hero reveal" id="intro" data-section>
        <span class="eyebrow">Luồng Agent · Sequence diagram · Evidence</span>
        <h1>Đi theo một request từ user thinking đến evidence.</h1>
        <p class="lead">Tutorial này minh họa cách một yêu cầu đi qua user thinking, prompt, agent, skill, blocked rules và local governance.</p>
      </section>
      <section class="section reveal" id="agent-internals" data-section>
        <h2>Cách agent hoạt động bên trong</h2>
        <p class="section-intro">Mỗi khi user gõ một request, Copilot thực hiện 4 bước tự động — user không cần làm gì thêm.</p>
        <div class="agent-internals-flow">
          <div class="ai-step-block">
            <div class="ai-step-head"><span class="ai-step-num">1</span><div><h3>Load instructions tự động</h3><p>Copilot đọc <code>.github/copilot-instructions.md</code> cho <em>mọi</em> request. Nếu file đính kèm khớp pattern <code>applyTo</code> trong <code>.github/instructions/</code>, file đó cũng tự nạp.</p></div></div>
            <div class="step-pair">
              <div class="step-pair-row"><span class="sp-label user-label">User</span><span class="sp-text">Gõ message, mở file, đính kèm context bằng <code>#file:</code></span></div>
              <div class="step-pair-row"><span class="sp-label ai-label">AI</span><span class="sp-text">Tự động merge <code>copilot-instructions.md</code> + path-specific instructions vào system prompt</span></div>
            </div>
          </div>
          <div class="ai-step-block">
            <div class="ai-step-head"><span class="ai-step-num">2</span><div><h3>Chọn agent + load skill</h3><p>Nếu user gõ <code>@AgentName</code>, agent profile trong <code>.github/agents/</code> được nạp và agent tự chọn skill phù hợp theo description matching. Không gõ agent → Copilot dùng mode hiện tại (Ask / Agent / Plan).</p></div></div>
            <div class="step-pair">
              <div class="step-pair-row"><span class="sp-label user-label">User gõ <code>@Planner</code></span><span class="sp-text">→ <code>Planner.agent.md</code> được nạp</span></div>
              <div class="step-pair-row"><span class="sp-label ai-label">AI load skill</span><span class="sp-text"><code>planning-governance/SKILL.md</code> nạp tự động theo tool description match — user không cần gõ tên skill</span></div>
            </div>
          </div>
          <div class="ai-step-block">
            <div class="ai-step-head"><span class="ai-step-num">3</span><div><h3>Policy guard — blocked-rules</h3><p><code>blocked-rules.md</code> là policy kernel luôn active. Kiểm tra: banned packages, forbidden patterns, secret/PII exposure, security red lines. Request vi phạm bị flag hoặc từ chối trước khi AI generate output.</p></div></div>
            <div class="step-pair">
              <div class="step-pair-row"><span class="sp-label user-label">User</span><span class="sp-text">Không cần can thiệp nếu request hợp lệ</span></div>
              <div class="step-pair-row"><span class="sp-label ai-label">AI</span><span class="sp-text">Tự động reject/flag + giải thích lý do + đề xuất phương án thay thế</span></div>
            </div>
          </div>
          <div class="ai-step-block">
            <div class="ai-step-head"><span class="ai-step-num">4</span><div><h3>Generate output + evidence</h3><p>AI tạo output theo toàn bộ context đã nạp. Output phải kèm evidence phù hợp với loại task: plan, verification commands, review findings, residual risk, docs update note.</p></div></div>
            <div class="step-pair">
              <div class="step-pair-row"><span class="sp-label user-label">User nhận</span><span class="sp-text">Response có cấu trúc + evidence. Panel "Used N references" trong VS Code liệt kê file instructions đã dùng.</span></div>
              <div class="step-pair-row"><span class="sp-label ai-label">AI</span><span class="sp-text">Không claim "done" nếu chưa có compile/test/review hoặc ghi rõ check chưa chạy</span></div>
            </div>
          </div>
        </div>
      </section>
      <section class="section reveal" id="pipeline" data-section>
        <h2>Sơ đồ Agent Request Pipeline</h2>
        <p class="section-intro">Request đi qua 5 tầng: User → Prompt Router → Agent Runtime → Policy Guard → Evidence Output.</p>
        <pre class="mermaid">
%%{init: {'flowchart': {'wrappingWidth': 340}}}%%
flowchart TD
    U["01 · User Request\\nintent + constraints\\ntask scope + expected output"]
    P["02 · Prompt Router\\n/scout · /banking-plan · /implement"]
    A["03 · Agent Runtime\\nPlanner · Analyst · Reviewer · Tester"]
    G["04 · Policy Guard\\nsecurity · privacy · component-first"]
    E["05 · Evidence Output\\nverification · review · delivery log"]
    U --> P --> A --> G --> E
        </pre>
      </section>
      <section class="section reveal" id="steps" data-section>
        <h2>Luồng chi tiết từng bước</h2>
        <p class="section-intro">Click từng bước để xem chính xác user làm gì và AI xử lý gì bên trong.</p>
        <div class="stepper">
          <div class="step-tabs">
            <button class="step-tab active" data-step="think" type="button"><span class="step-tab-index">1</span><span class="step-tab-copy"><strong>User thinking</strong><small>Gõ goal, file context và constraint</small></span></button>
            <button class="step-tab" data-step="agent" type="button"><span class="step-tab-index">2</span><span class="step-tab-copy"><strong>Agent routing</strong><small>Load instruction, agent và skill</small></span></button>
            <button class="step-tab" data-step="policy" type="button"><span class="step-tab-index">3</span><span class="step-tab-copy"><strong>Policy check</strong><small>Block package, secret và scope drift</small></span></button>
            <button class="step-tab" data-step="evidence" type="button"><span class="step-tab-index">4</span><span class="step-tab-copy"><strong>Evidence</strong><small>Trả plan, verification và residual risk</small></span></button>
          </div>

          <div class="step-panel active" data-step="think">
            <div class="step-section-label">User làm gì</div>
            <p>Gõ message rõ ràng gồm: intent, agent name, file context bằng <code>#file:</code>, và constraint nếu có giới hạn scope.</p>
            <div class="code-card"><pre><code>@Planner Thêm rate-limiting cho endpoint POST /api/payments
#file:src/Controllers/PaymentController.cs
#file:src/Services/PaymentService.cs
Constraint: dùng component có sẵn trong codebase, không thêm package mới.</code></pre></div>
            <div class="step-section-label">AI nhận được gì</div>
            <p>Copilot tự build context: message + file đính kèm + <code>copilot-instructions.md</code> + <code>aspnet-core.instructions.md</code> (match *.cs) + <code>Planner.agent.md</code> + <code>planning-governance/SKILL.md</code>. Không cần user config tay.</p>
            <div class="step-section-label">Tại sao cần gõ constraint?</div>
            <p>Constraint rõ ràng giúp AI không mở rộng scope, không propose package bên ngoài codebase. Thiếu constraint → AI có thể suggest <code>AspNetCoreRateLimit</code> hoặc package lạ.</p>
          </div>

          <div class="step-panel" data-step="agent">
            <div class="step-section-label">Thứ tự load của AI</div>
            <div class="code-card"><pre><code>// Copilot tự chạy — không cần user làm gì
1. copilot-instructions.md          → banking gates, style governance, blocked-rules pointer
2. aspnet-core.instructions.md      → nạp vì có *.cs trong context (applyTo: **/*.cs)
3. Planner.agent.md                 → agent profile, tool restrictions, behavior rules
4. planning-governance/SKILL.md     → skill nạp theo description match của agent
5. blocked-rules.md                 → policy kernel, luôn active</code></pre></div>
            <div class="step-section-label">User thấy gì trong VS Code</div>
            <p>Đầu mỗi response có panel <b>"Used N references"</b> — click để xem file instructions nào đã được dùng. Đây là cách verify rằng đúng context đã nạp.</p>
            <div class="step-section-label">Nếu không gõ @agent</div>
            <p>Copilot dùng mode đang chọn ở bottom của chat: <b>Ask</b> (Q&A), <b>Agent</b> (tự edit file), hoặc <b>Plan</b> (lên plan rồi hỏi user). Instructions vẫn nạp như thường.</p>
          </div>

          <div class="step-panel" data-step="policy">
            <div class="step-section-label">Policy gate chạy tự động</div>
            <div class="code-card"><pre><code>// Trước khi AI viết bất cứ thứ gì:
component-first    → search IMemoryCache trong codebase → found ✓ (dùng cái có sẵn)
blocked-rules      → kiểm tra banned packages → không có → pass ✓
scope-guard        → chỉ rate-limiting, không refactor ngoài scope → pass ✓
secret-scan        → không PII/token/credential trong output → pass ✓
least-privilege    → không require quyền cao hơn cần thiết → pass ✓</code></pre></div>
            <div class="step-section-label">Nếu fail policy</div>
            <p>AI flag cụ thể: <em>"blocked-rules: package X bị cấm — đây là lý do và phương án thay thế"</em>. User điều chỉnh request và submit lại.</p>
            <div class="step-section-label">User làm gì ở bước này</div>
            <p>Không can thiệp nếu pass. Nếu AI cảnh báo → đọc cảnh báo, quyết định adjust request hay proceed với justification.</p>
          </div>

          <div class="step-panel" data-step="evidence">
            <div class="step-section-label">Output chuẩn từ @Planner</div>
            <div class="code-card"><pre><code>## Plan: Add Rate-Limiting to POST /api/payments

Goal        : Giới hạn request per client để ngăn abuse
Scope       : RateLimitingMiddleware + DI registration trong Program.cs
Non-goals   : Không sửa business logic, không thêm package mới
Affected    : src/Middleware/RateLimitingMiddleware.cs (mới)
              src/Program.cs (thêm DI + pipeline registration)
Phase 1     : Tạo middleware class dùng IMemoryCache
Phase 2     : Register DI và thêm vào pipeline
Risks       : Race condition với concurrent requests
Rollback    : Xóa UseMiddleware&lt;RateLimitingMiddleware&gt;() khỏi Program.cs
Verify      : dotnet test --filter "RateLimit" --no-build
Residual    : Distributed cache scenario chưa test</code></pre></div>
            <div class="step-section-label">User làm gì tiếp theo</div>
            <p>Đọc plan. Nếu thiếu gì → hỏi AI revise. Khi đồng ý → gõ <em>"Plan approved. Proceed with phase 1."</em> Chỉ lúc này AI mới bắt đầu viết code.</p>
          </div>
        </div>
      </section>`,
    toc: [
      ["#intro", "Giới thiệu"],
      ["#agent-internals", "Agent chạy thế nào"],
      ["#pipeline", "Pipeline"],
      ["#steps", "Luồng chi tiết"],
    ],
  },
  "quick-reference.html": {
    title: "Tra cứu nhanh",
    main: `
      <section class="doc-hero reveal" id="start" data-section>
        <span class="eyebrow">Reference · Prompts · Agents · Commands</span>
        <h1>Bảng tra nhanh toàn bộ hệ thống.</h1>
        <p class="lead">Danh sách đầy đủ prompt, agent, lệnh Git và script cần dùng hằng ngày.</p>
      </section>
      <section class="section reveal" id="agents" data-section>
        <h2>Agent</h2>
        <div class="ref-grid">
          <div class="ref-card">
            <div class="ref-card-header"><span class="arch-icon agent-icon--planner">PL</span><div><b>@Planner</b><small>Plan before implement</small></div></div>
            <div class="ref-pills"><span class="pill">@Planner [task]</span><span class="pill">Plan approved. Proceed.</span></div>
          </div>
          <div class="ref-card">
            <div class="ref-card-header"><span class="arch-icon agent-icon--analyst">SA</span><div><b>@System Analyst</b><small>Architecture · blast radius</small></div></div>
            <div class="ref-pills"><span class="pill">@System Analyst [area]</span></div>
          </div>
          <div class="ref-card">
            <div class="ref-card-header"><span class="arch-icon agent-icon--reviewer">CR</span><div><b>@Code Reviewer</b><small>Review từng dòng · severity</small></div></div>
            <div class="ref-pills"><span class="pill">@Code Reviewer #file:</span><span class="pill">Critical → Low</span></div>
          </div>
          <div class="ref-card">
            <div class="ref-card-header"><span class="arch-icon agent-icon--security">SR</span><div><b>@Security Reviewer</b><small>Auth · PII · Crypto</small></div></div>
            <div class="ref-pills"><span class="pill">@Security Reviewer #file:</span></div>
          </div>
          <div class="ref-card">
            <div class="ref-card-header"><span class="arch-icon agent-icon--tester">T</span><div><b>@Tester</b><small>Tìm và chạy test commands</small></div></div>
            <div class="ref-pills"><span class="pill">@Tester [area]</span><span class="pill">pass/fail + root cause</span></div>
          </div>
          <div class="ref-card">
            <div class="ref-card-header"><span class="arch-icon agent-icon--docs">DM</span><div><b>@Docs Manager</b><small>Cập nhật tài liệu</small></div></div>
            <div class="ref-pills"><span class="pill">@Docs Manager [change]</span></div>
          </div>
          <div class="ref-card">
            <div class="ref-card-header"><span class="arch-icon agent-icon--researcher">R</span><div><b>@Researcher</b><small>Context trong repo</small></div></div>
            <div class="ref-pills"><span class="pill">@Researcher [query]</span></div>
          </div>
          <div class="ref-card">
            <div class="ref-card-header"><span class="arch-icon agent-icon--architect">RA</span><div><b>@Research Architect</b><small>ADR · architecture tradeoffs</small></div></div>
            <div class="ref-pills"><span class="pill">@Research Architect [question]</span></div>
          </div>
        </div>
      </section>
      <section class="section reveal" id="prompts" data-section>
        <h2>Prompt</h2>
        <div class="quick-grid">
          <div class="quick-row"><span class="quick-label">Ngữ cảnh</span><div class="quick-pills"><span class="pill">/scout</span><span class="pill">/analyze-code</span><span class="pill">#file:</span><span class="pill">#codebase</span></div></div>
          <div class="quick-row"><span class="quick-label">Plan</span><div class="quick-pills"><span class="pill">/banking-plan</span><span class="pill">/plan</span></div></div>
          <div class="quick-row"><span class="quick-label">Implement</span><div class="quick-pills"><span class="pill">/implement</span></div></div>
          <div class="quick-row"><span class="quick-label">Review</span><div class="quick-pills"><span class="pill">/line-review</span></div></div>
          <div class="quick-row"><span class="quick-label">Test</span><div class="quick-pills"><span class="pill">/test</span></div></div>
          <div class="quick-row"><span class="quick-label">Docs</span><div class="quick-pills"><span class="pill">/docs-update</span></div></div>
        </div>
      </section>
      <section class="section reveal" id="git" data-section>
        <h2>Lệnh Git</h2>
        <div class="code-card"><pre><code>git diff --stat
git add &lt;specific files&gt;
git commit -m "feat(scope): description"
git push
.github\scripts\pre-push-governance-check.ps1 -Mode Enforce</code></pre></div>
      </section>`,
    toc: [
      ["#start", "Giới thiệu"],
      ["#agents", "Agent"],
      ["#prompts", "Prompt"],
      ["#git", "Git"],
    ],
  },
};

function getPageName(href) {
  const src = href || window.location.pathname;
  const parts = src.split("/");
  return parts[parts.length - 1] || "index.html";
}

function getPageHref(page) {
  return page === "index.html" ? "./" : page;
}

function safePushPageState(page) {
  if (!window.history || typeof window.history.pushState !== "function") return;
  if (window.location.protocol === "file:") return;
  try {
    window.history.pushState({ page }, "", getPageHref(page));
  } catch (_error) {
    // Local file mode and locked-down browser contexts can reject pushState.
  }
}

function safeReplaceHash(hash) {
  if (!window.history || typeof window.history.replaceState !== "function")
    return;
  if (window.location.protocol === "file:") return;
  try {
    const baseHref = getPageHref(getPageName());
    const nextUrl = hash ? `${baseHref}${hash}` : baseHref;
    window.history.replaceState(window.history.state, "", nextUrl);
  } catch (_error) {
    // Keep navigation smooth even when history mutations are blocked.
  }
}

function scrollToCurrentHash() {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (!target) return;
  target.scrollIntoView({ behavior: "auto", block: "start" });
}

function renderPage(page, pushState = true, scrollTop = true) {
  const data = PAGE_DATA[page] || PAGE_DATA["index.html"];
  document.title = data.title + " · Project AI";
  const main =
    document.getElementById("main-content") || document.querySelector("main");
  if (main) {
    main.classList.add("is-swapping");
    main.innerHTML = data.main;
  }
  let toc = document.getElementById("toc");
  if (!toc) {
    const rs = document.querySelector(".right-sidebar");
    if (rs) {
      toc = document.createElement("ul");
      toc.id = "toc";
      toc.className = "toc-list";
      rs.appendChild(toc);
    }
  }
  if (toc && data.toc) {
    toc.innerHTML = data.toc
      .map(([href, label]) => `<li><a href="${href}">${label}</a></li>`)
      .join("");
  }
  // Update left sidebar active state
  document.querySelectorAll(".nav-tree .nav-item").forEach((a) => {
    const href = a.getAttribute("href");
    a.classList.toggle(
      "active",
      href === page || (page === "index.html" && href === "index.html"),
    );
  });
  // Update topbar nav active state
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    const linkPage = href ? href.split("/").pop() : "";
    a.classList.toggle("active", linkPage === page);
  });
  if (pushState) {
    safePushPageState(page);
  }
  if (scrollTop) window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    if (main) main.classList.remove("is-swapping");
    initDynamicContent();
    if (!scrollTop) scrollToCurrentHash();
  });
}

function loadMermaid() {
  if (window._mermaidLoaded) return Promise.resolve();
  return new Promise((resolve) => {
    if (window.mermaid) {
      window._mermaidLoaded = true;
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
    script.onload = () => {
      window._mermaidLoaded = true;
      window.mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        flowchart: { wrappingWidth: 400 },
        themeVariables: {
          primaryColor: "#0ea5e9",
          primaryTextColor: "#ffffff",
          primaryBorderColor: "#38bdf8",
          lineColor: "#22d3ee",
          secondaryColor: "#0284c7",
          tertiaryColor: "#0369a1",
          background: "#071b2a",
          mainBkg: "#0ea5e9",
          nodeBorder: "#38bdf8",
          clusterBkg: "#0c4a6e",
          titleColor: "#e5f8ff",
          edgeLabelBackground: "#0c4a6e",
          labelTextColor: "#ffffff",
          nodeTextColor: "#ffffff",
          actorBkg: "#0369a1",
          actorBorder: "#38bdf8",
          actorTextColor: "#ffffff",
          actorLineColor: "#22d3ee",
          signalColor: "#22d3ee",
          signalTextColor: "#e5f8ff",
          loopTextColor: "#e5f8ff",
          noteBkgColor: "#075985",
          noteTextColor: "#e5f8ff",
          noteBorderColor: "#38bdf8",
          activationBkgColor: "#0284c7",
          activationBorderColor: "#38bdf8",
          sequenceNumberColor: "#ffffff",
          fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system",
          fontSize: "14px",
        },
      });
      resolve();
    };
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
}

function patchMermaidSvg() {
  const NODE_COLORS = {
    workspace: { fill: "#1e3a8a", stroke: "#60a5fa" },
    runtime: { fill: "#1d4ed8", stroke: "#93c5fd" },
    policy: { fill: "#1e40af", stroke: "#4f8ef7" },
    agents: { fill: "#2563eb", stroke: "#bfdbfe" },
    support: { fill: "#1a2d6b", stroke: "#60a5fa" },
    safety: { fill: "#2d1a4b", stroke: "#f87171" },
    evidence: { fill: "#14285e", stroke: "#34d399" },
    gov: { fill: "#080f2e", stroke: "#60a5fa" },
    _default: { fill: "#1a2d6b", stroke: "#4f8ef7" },
  };
  document.querySelectorAll("pre.mermaid svg").forEach((svg) => {
    svg
      .querySelectorAll("text")
      .forEach((t) => t.style.setProperty("fill", "#dbeafe", "important"));
    svg
      .querySelectorAll(
        ".actor rect, .actor-man circle, .actor-man line, rect.actor",
      )
      .forEach((r) => {
        r.style.setProperty("fill", "#1a2d6b", "important");
        r.style.setProperty("stroke", "#60a5fa", "important");
      });
    svg
      .querySelectorAll(
        ".node rect, .node circle, .node ellipse, .node polygon, .node path",
      )
      .forEach((r) => {
        const nodeEl = r.closest(".node");
        let c = NODE_COLORS._default;
        if (nodeEl) {
          for (const k of Object.keys(NODE_COLORS)) {
            if (k !== "_default" && nodeEl.classList.contains(k)) {
              c = NODE_COLORS[k];
              break;
            }
          }
        }
        r.style.setProperty("fill", c.fill, "important");
        r.style.setProperty("stroke", c.stroke, "important");
        r.style.setProperty("stroke-width", "2px", "important");
      });
    svg.querySelectorAll(".cluster rect").forEach((r) => {
      r.style.setProperty("fill", "#060e2a", "important");
      r.style.setProperty("stroke", "#4f8ef7", "important");
    });
    svg
      .querySelectorAll(
        ".edgePath path, .flowchart-link, .messageLine0, .messageLine1",
      )
      .forEach((l) => {
        l.style.setProperty("stroke", "#60a5fa", "important");
      });
    svg
      .querySelectorAll("marker path, .arrowheadPath, #arrowhead path")
      .forEach((m) => {
        m.style.setProperty("fill", "#60a5fa", "important");
        m.style.setProperty("stroke", "#60a5fa", "important");
      });
    svg.querySelectorAll("rect.background, rect.labelBox").forEach((r) => {
      r.style.setProperty("fill", "#060e2a", "important");
    });
    svg.querySelectorAll(".note, .noteText").forEach((n) => {
      n.style.setProperty("fill", "#1a2d6b", "important");
    });
    svg
      .querySelectorAll(".activation0, .activation1, .activation2")
      .forEach((a) => {
        a.style.setProperty("fill", "#3b82f6", "important");
        a.style.setProperty("stroke", "#93c5fd", "important");
      });
    svg.querySelectorAll(".sequenceNumber").forEach((s) => {
      s.style.setProperty("fill", "#080f2e", "important");
    });
    svg
      .querySelectorAll(".node foreignObject div, .nodeLabel")
      .forEach((el) => {
        el.style.setProperty("font-size", "14px", "important");
        el.style.setProperty("line-height", "1.6", "important");
      });
    const TEXT_COLORS = {
      workspace: "#eff6ff",
      runtime: "#eff6ff",
      policy: "#dbeafe",
      agents: "#ffffff",
      support: "#bfdbfe",
      safety: "#fecaca",
      evidence: "#a7f3d0",
      gov: "#93c5fd",
      _default: "#eff6ff",
    };
    svg.querySelectorAll(".node foreignObject").forEach((fo) => {
      const nodeEl = fo.closest(".node");
      let textColor = TEXT_COLORS._default;
      if (nodeEl) {
        for (const k of Object.keys(TEXT_COLORS)) {
          if (k !== "_default" && nodeEl.classList.contains(k)) {
            textColor = TEXT_COLORS[k];
            break;
          }
        }
      }
      fo.querySelectorAll("div, span, p, b, strong").forEach((el) => {
        el.style.setProperty("color", textColor, "important");
      });
    });
  });
}

function initDynamicContent() {
  bindTocTracking();
  bindRevealEffects();
  bindCodeCopy();
  bindDiagramInteractions();
  bindArchitectureDiagram();
  bindSteppers();
  bindAgentCards();
  bindRightPanelLinks();
  const mermaids = [...document.querySelectorAll("pre.mermaid")];
  if (mermaids.length) {
    loadMermaid().then(() => {
      if (!window.mermaid) return;
      const result = window.mermaid.run({ nodes: mermaids });
      const applyPatch = () => setTimeout(patchMermaidSvg, 80);
      if (result && typeof result.then === "function") result.then(applyPatch);
      else applyPatch();
    });
  }
}

function bindTocTracking() {
  const sections = document.querySelectorAll("[data-section]");
  const tocLinks = document.querySelectorAll("#toc a");
  if (!sections.length || !tocLinks.length) return;
  if (tocObserver) tocObserver.disconnect();
  tocObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tocLinks.forEach((a) => {
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        }
      });
    },
    { rootMargin: "-20% 0px -70% 0px" },
  );
  sections.forEach((s) => tocObserver.observe(s));
}

function bindRevealEffects() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          revealObserver.unobserve(e.target);
        }
      }),
    { threshold: 0.1 },
  );
  els.forEach((el) => revealObserver.observe(el));
}

function bindCodeCopy() {
  document.querySelectorAll(".code-card pre").forEach((pre) => {
    if (pre.querySelector(".copy-btn")) return;
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(pre.textContent.trim()).then(() => {
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy"), 1500);
      });
    });
    pre.style.position = "relative";
    pre.appendChild(btn);
  });
}

function bindDiagramInteractions() {
  document.querySelectorAll(".diagram-node[data-href]").forEach((node) => {
    node.style.cursor = "pointer";
    node.addEventListener("click", () => {
      const page = node.dataset.href;
      if (PAGE_DATA[page]) renderPage(page);
    });
  });
  document.querySelectorAll(".diagram-node[data-related]").forEach((node) => {
    node.addEventListener("mouseenter", () => {
      const related = (node.dataset.related || "").split(",");
      document.querySelectorAll(".diagram-node").forEach((n) => {
        n.classList.toggle(
          "dim",
          !related.includes(n.dataset.node) && n !== node,
        );
      });
    });
    node.addEventListener("mouseleave", () => {
      document
        .querySelectorAll(".diagram-node")
        .forEach((n) => n.classList.remove("dim"));
    });
  });
}

function bindArchitectureDiagram() {
  // Tooltip for diagram nodes
  document.querySelectorAll(".diagram-node[data-tip]").forEach((node) => {
    const tip = document.createElement("div");
    tip.className = "diagram-tip";
    tip.textContent = node.dataset.tip;
    node.appendChild(tip);
  });
}

function bindSteppers() {
  document.querySelectorAll(".stepper").forEach((stepper) => {
    const tabs = stepper.querySelectorAll(".step-tab");
    const panels = stepper.querySelectorAll(".step-panel");
    tabs.forEach((tab) => {
      tab.addEventListener("click", (event) => {
        event.preventDefault();
        const step = tab.dataset.step;
        tabs.forEach((t) => t.classList.toggle("active", t === tab));
        panels.forEach((p) =>
          p.classList.toggle("active", p.dataset.step === step),
        );
      });
    });
  });
}

function bindAgentCards() {
  document.querySelectorAll(".agent-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const body = btn.nextElementSibling;
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      body.hidden = expanded;
    });
  });
}

function bindRightPanelLinks() {
  document.querySelectorAll("#toc a[href^='#']").forEach((a) => {
    a.addEventListener("click", (event) => {
      const targetSelector = a.getAttribute("href");
      if (!targetSelector) return;
      const target = document.querySelector(targetSelector);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      safeReplaceHash(targetSelector);
    });
  });
  document.querySelectorAll(".right-sidebar a[href$='.html']").forEach((a) => {
    a.addEventListener("click", (e) => {
      const page = getPageName(a.getAttribute("href"));
      if (PAGE_DATA[page]) {
        e.preventDefault();
        renderPage(page);
      }
    });
  });
}

function bindSidebarControls() {
  const toggle = document.querySelector(".sidebar-toggle");
  const sidebar = document.querySelector(".left-sidebar");
  const layout = document.querySelector(".docs-layout");
  if (!toggle || !sidebar || !layout) return;

  const applySidebarState = (collapsed) => {
    sidebar.classList.toggle("is-collapsed", collapsed);
    layout.classList.toggle("nav-collapsed", collapsed);
    toggle.textContent = collapsed ? ">>" : "<<";
    toggle.setAttribute(
      "aria-label",
      collapsed ? "Mở thanh điều hướng" : "Ẩn thanh điều hướng",
    );
    toggle.setAttribute("aria-expanded", String(!collapsed));
  };

  let savedState = false;
  try {
    savedState = window.localStorage.getItem(DOC_NAV_STATE_KEY) === "true";
  } catch (_error) {
    savedState = false;
  }
  applySidebarState(savedState);

  toggle.addEventListener("click", () => {
    const nextCollapsed = !sidebar.classList.contains("is-collapsed");
    applySidebarState(nextCollapsed);
    try {
      window.localStorage.setItem(DOC_NAV_STATE_KEY, String(nextCollapsed));
    } catch (_error) {
      // Ignore storage failures and keep the current session state.
    }
  });
}

function ensureFooter() {
  if (!document.querySelector("footer")) {
    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="footer-brand-mark">
            <svg width="22" height="18" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="3" y="3" width="6" height="6" rx="1.6" stroke="currentColor" stroke-width="1.8"/>
              <rect x="15" y="3" width="6" height="6" rx="1.6" stroke="currentColor" stroke-width="1.8"/>
              <rect x="9" y="12" width="6" height="5" rx="1.6" stroke="currentColor" stroke-width="1.8"/>
              <path d="M9 6H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M12 9V12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </span>
          <div>
            <div>Project AI</div>
            <div class="footer-smartsales">Smartsales AI Team &middot; contact@smartsales.example.com</div>
          </div>
        </div>
        <nav class="footer-links">
          <a href="index.html">Hướng dẫn sử dụng</a>
          <a href="overview.html">Tổng quan</a>
          <a href="usage.html">Cách dùng</a>
          <a href="tutorial-agent-flow.html">Luồng Agent</a>
          <a href="quick-reference.html">Tra cứu nhanh</a>
        </nav>
        <span class="footer-copy">&copy; ${new Date().getFullYear()} &middot; Tài liệu local-only &middot; Không dùng dữ liệu production</span>
      </div>`;
    document.body.appendChild(footer);
  }
}

function bindLocalNavigation() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || !href.endsWith(".html")) return;
    const page = getPageName(href);
    if (!PAGE_DATA[page]) return;
    event.preventDefault();
    renderPage(page);
  });

  window.addEventListener("popstate", () => {
    renderPage(getPageName(), false, false);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindSidebarControls();
  bindLocalNavigation();
  ensureFooter();
  renderPage(getPageName(), false, false);
  document.body.classList.add("is-loaded");
});
