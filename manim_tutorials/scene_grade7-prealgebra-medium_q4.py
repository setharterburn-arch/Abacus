from manim import *

class Grade7PrealgebraMedium4(Scene):
    def construct(self):
        expression = MathTex("4^2 - 2 \times 3 + 1").scale(1.2)
        self.play(Write(expression))
        self.wait(1)

        step1 = MathTex("16 - 2 \times 3 + 1").next_to(expression, DOWN, buff=0.5).scale(1.2)
        arrow1 = Arrow(expression.get_bottom(), step1.get_top(), buff=0.1)
        self.play(TransformFromCopy(expression, step1), Create(arrow1))
        self.wait(1)

        step2 = MathTex("16 - 6 + 1").next_to(step1, DOWN, buff=0.5).scale(1.2)
        arrow2 = Arrow(step1.get_bottom(), step2.get_top(), buff=0.1)
        self.play(TransformFromCopy(step1, step2), Create(arrow2))
        self.wait(1)

        step3 = MathTex("10 + 1").next_to(step2, DOWN, buff=0.5).scale(1.2)
        arrow3 = Arrow(step2.get_bottom(), step3.get_top(), buff=0.1)
        self.play(TransformFromCopy(step2, step3), Create(arrow3))
        self.wait(1)

        step4 = MathTex("11").next_to(step3, DOWN, buff=0.5).scale(1.2)
        arrow4 = Arrow(step3.get_bottom(), step4.get_top(), buff=0.1)
        self.play(TransformFromCopy(step3, step4), Create(arrow4))
        self.wait(1)

        self.play(FadeOut(expression, step1, step2, step3, step4, arrow1, arrow2, arrow3, arrow4))
        answer = MathTex("\text{Answer: } 11").scale(1.5)
        self.play(Write(answer))
        self.wait(2)