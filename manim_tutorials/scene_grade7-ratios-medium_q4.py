from manim import * 

class Grade7RatiosMedium3(Scene):
    def construct(self):
        ratio = MathTex(r'\frac{12}{18}').to_edge(UP)
        self.play(Write(ratio))

        gcf = MathTex(r'\text{GCF}(12, 18) = 6').next_to(ratio, DOWN, buff=0.5)
        self.play(Write(gcf))

        divide_by_gcf = MathTex(r'\frac{12 \div 6}{18 \div 6}').next_to(gcf, DOWN, buff=0.5)
        self.play(Write(divide_by_gcf))

        simplified_ratio = MathTex(r'= \frac{2}{3}').next_to(divide_by_gcf, RIGHT, buff=0.5)
        self.play(Write(simplified_ratio))

        final_ratio = MathTex(r'2:3').next_to(simplified_ratio, DOWN, buff=0.5)
        self.play(Write(final_ratio))

        self.wait(3)