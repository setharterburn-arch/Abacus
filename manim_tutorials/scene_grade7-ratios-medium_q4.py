from manim import *

class Grade7RatiosMedium4(Scene):
    def construct(self):
        original_ratio = MathTex(r'4:6', color=WHITE).scale(1.2)
        self.play(Write(original_ratio))
        self.wait(1)

        simplified_ratio = MathTex(r'2:3', color=GREEN).next_to(original_ratio, DOWN, buff=0.5).scale(1.2)
        self.play(Write(simplified_ratio))
        self.wait(2)

        self.play(FadeOut(original_ratio, simplified_ratio))
